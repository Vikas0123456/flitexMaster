const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Sequelize, sequelize } = require("../config/connection");
const { createErrorLog } = require("../utiles/logmanager/logger");
const { insertLog } = require("./systemLogController");
const flitexMasterUsersModel = require("../models/fliteXMasterUserModel");
const { forgotPasswordMail } = require("./emailController");

const userLogin = async (req, res, next) => {
    let userId = null;
    try {
        const { email, password } = req.body;
        const checkUser = await sequelize.query(
            "EXEC getUserByEmail @email = :email",
            {
                replacements: {
                    email: email,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        if (!checkUser[0].length > 0) {
            return res
                .status(200)
                .json({ status: 202, message: "User is not exist" });
        }
        if (!checkUser[0][0].isActive) {
            return res.status(200).json({
                status: 202,
                message:
                    "Your account is deactivated! Please contact administrator.",
            });
        }

        userId = checkUser[0][0].id;
        const isPasswordValid = await bcrypt.compare(
            password,
            checkUser[0][0].password
        );

        if (!isPasswordValid) {
            return res.status(400).json({
                status: 202,
                message: "Invalid username or password.",
            });
        }

        const payload = {
            id: checkUser[0][0].id,
            email: email,
            password: password,
        };

        if (!payload || typeof payload !== "object") {
            throw new Error("Invalid payload");
        }
        const token = jwt.sign(payload, process.env.SECRECT_KEY, {
            expiresIn: "7d",
        });
        insertLog(`${userId}`, "Login", "Users", checkUser[0][0].id, email);
        return res.status(200).json({
            status: 200,
            message: "User login successfully.",
            data: { token, checkUser },
        });
    } catch (error) {
        createErrorLog(error.message, "Login", "Users", userId, email);
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const sentResetPasswordMail = async (req, res) => {
    let userId = null;
    try {
        const { email } = req.body;
        const existingUser = await sequelize.query(
            "EXEC getUserByEmail @email = :email",
            {
                replacements: {
                    email: email,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        if (existingUser[0].length == 0) {
            return res
                .status(200)
                .json({ status: 202, message: "User is not exist" });
        }
        userId = existingUser[0][0].id;
        const payload = {
            id: existingUser[0][0].id,
            email: email,
            password: existingUser[0][0].password,
        };

        const updateToken = jwt.sign(payload, process.env.SECRECT_KEY, {
            expiresIn: "3h",
        });
        const OTP = Math.floor(Math.random() * 900000 + 100000);
        await flitexMasterUsersModel.update(
            { verificationCode: OTP },
            {
                where: {
                    id: existingUser[0][0].id,
                },
            }
        );
        const settings = await sequelize.query(
            `
          SELECT id, name, value, isActive FROM setting WHERE isDeleted = 0 AND name = 'RESEND_OTP_TIME'
        `,
            {
                type: Sequelize.QueryTypes.SELECT,
            }
        );
        await forgotPasswordMail(email, OTP);
        insertLog(
            `${userId}`,
            "Forgot Password",
            "Users",
            existingUser[0][0].id,
            email
        );
        return res.status(200).json({
            status: 200,
            message:
                "Reset password OTP has been sent successfully to your registered email adderess",
            data: updateToken,
            settings: settings,
        });
    } catch (error) {
        console.log(error);
        createErrorLog(
            error.message,
            "Forgot Password",
            "Users",
            userId,
            email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const confirmOtp = async (req, res) => {
    try {
        const { otp, token } = req.body;
        const tokenVerification = jwt.verify(token, process.env.SECRECT_KEY, {
            complete: true,
        });

        const { id } = tokenVerification.payload;

        const userData = await flitexMasterUsersModel.findByPk(id);

        if (userData.verificationCode !== otp) {
            return res.status(200).json({
                status: 202,
                message: `OTP is wrong`,
            });
        } else {
            await flitexMasterUsersModel.update(
                {
                    otp: "",
                },
                {
                    where: {
                        id: id,
                    },
                }
            );
            return res.status(200).json({
                status: 200,
                message: `OTP has been verified successfully`,
            });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const resetUserPassword = async (req, res) => {
    let userId = null;
    try {
        const { token, newPassword } = req.body;
        const { payload } = jwt.verify(token, process.env.SECRECT_KEY, {
            complete: true,
        });
        userId = payload.id;
        const saltRounds = 8;
        const password = await bcrypt.hash(newPassword, saltRounds);
        await flitexMasterUsersModel.update(
            {
                password: password,
            },
            {
                where: { id: payload.id },
            }
        );
        insertLog(`${userId}`, "Reset Password", "Users", payload.id, "N/A");
        return res.status(200).json({
            status: 200,
            message: `Password has been updated successfully`,
        });
    } catch (error) {
        createErrorLog(error.message, "Reset Password", "Users", userId, email);
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const changePassword = async (req, res) => {
    try {
        const { user } = req;
        const { oldPassword, newPassword } = req.body;
        const result = await sequelize.query(
            "EXEC getFlitexMasterUserById @id = :id",
            {
                replacements: {
                    id: user.id,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        if (!result[0].length > 0) {
            return res
                .status(200)
                .json({ status: 202, message: "User does not exist" });
        }
        const isPasswordValid = await bcrypt.compare(
            oldPassword,
            result[0][0].password
        );
        if (!isPasswordValid) {
            return res
                .status(200)
                .json({ status: 202, message: "Old password is wrong" });
        }
        const workFactor = 8;
        const hash = await bcrypt.hash(newPassword, workFactor);
        await flitexMasterUsersModel.update(
            { password: hash },
            {
                where: {
                    id: user.id,
                },
            }
        );
        insertLog(`${user.id}`, "Change Password", "Users", req.user.id, "N/A");
        return res.status(200).json({
            status: 200,
            message:
                "Password is updated successfully. You are redirecting to login, Please login again",
            data: result,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "getById",
            "flitexMasterUser",
            req.user.id,
            req.user.email
        );
        return res.status(500).json({
            status: 500,
            message: "Something went wrong. Please try again later",
        });
    }
};

const getFlitexMasterUserProfileDetails = async (req, res) => {
    try {
        const { id } = req.user;
        const userData = await flitexMasterUsersModel.findByPk(id);
        return res.status(200).json({
            status: 200,
            message: "User data retrieved successfully",
            data: userData,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "getUserProfile",
            "flitexMasterUser",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const changeFlitexMasterUserProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const { firstName, lastName, isImageEdited } = req.body;
        const isEdit = isImageEdited == "true" ? true : false;
        const getFlitexMasterUser = await flitexMasterUsersModel.findByPk(id);
        if (getFlitexMasterUser) {
            await flitexMasterUsersModel.update(
                {
                    firstName: firstName,
                    lastName: lastName,
                    profilePic: isEdit ? req.file.filename : req.body.filename,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );
            insertLog(
                `${id}`,
                "Profile Update",
                "Users",
                req.user.id,
                firstName + " " + lastName
            );
            return res.status(200).json({
                status: 200,
                message: "Your profile has been updated successfully",
            });
        } else {
            return res.status(200).json({
                status: 202,
                message: "User is not exists",
            });
        }
    } catch (error) {
        createErrorLog(
            error.message,
            "Profile Update",
            "Users",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

module.exports = {
    userLogin,
    sentResetPasswordMail,
    resetUserPassword,
    changePassword,
    confirmOtp,
    changeFlitexMasterUserProfile,
    getFlitexMasterUserProfileDetails,
};
