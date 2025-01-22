const { sequelize } = require("../config/connection");
const { Sequelize } = require("sequelize");
const flitexMasterUsersModel = require("../models/fliteXMasterUserModel");
const bcrypt = require("bcryptjs");
const { createErrorLog } = require("../utiles/logmanager/logger");
const { insertLog } = require("./systemLogController");
const { imageRemove, generateExcelData } = require("../utiles/commonFunction");
const fs = require("fs");

const createFlitexMasterUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, isActive } = req.body;
        const workFactor = 8;
        const hashPassword = await bcrypt.hash(password, workFactor);

        const checkIsExistsOrNot = await sequelize.query(
            `SELECT * FROM flitex_master_user WHERE email = '${email}'`
        );

        if (checkIsExistsOrNot[0].length > 0) {
            return res.status(200).json({
                status: 202,
                message:
                    "Email is already exists. Please try different credintials",
            });
        }

        const result = await sequelize.query(
            "EXEC insertFlitexMaterUserData @firstName = :firstName, @lastName = :lastName, @email = :email, @password = :password, @profilePic = :profilePic, @isActive = :isActive, @isAdmin = :isAdmin, @verificationCode = :verificationCode",
            {
                replacements: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: hashPassword,
                    profilePic: req.file.filename,
                    isActive: isActive,
                    isAdmin: "0",
                    verificationCode: null,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        insertLog(
            `${result[0][0].flitexMasterUserId}`,
            "Insert",
            "Users",
            req.user.id,
            email
        );
        return res.status(200).json({
            status: 200,
            message: "User data has been created successfully",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Insert",
            "Users",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const updateFlitexMasterUser = async (req, res) => {
    try {
        const id = req.params.id;
        const getFlitexMasterUser = await flitexMasterUsersModel.findByPk(id);
        const {
            firstName,
            lastName,
            email,
            password,
            isActive,
            isImageEdited,
            isPasswordEdited,
            isAdmin,
        } = req.body;
        const isEdit = isImageEdited == "true" ? true : false;
        const isEditPassword = isPasswordEdited == "true" ? true : false;

        const workFactor = 8;
        let hashPassword = null;
        if (isEditPassword) {
            hashPassword = await bcrypt.hash(password, workFactor);
        }

        let query =
            "EXEC updateFlitexMasterUserData @id = :id, @firstName = :firstName, @lastName = :lastName, @email = :email, @password = :password, @isActive = :isActive, @profilePic = :profilePic, @isAdmin = :isAdmin";

        await sequelize.query(query, {
            replacements: {
                id: id,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: isEditPassword ? hashPassword : password,
                profilePic: isEdit ? req.file.filename : req.body.filename,
                isActive: isActive,
                isAdmin: isAdmin,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        if (isEdit) {
            await imageRemove(getFlitexMasterUser.profilePic);
        }
        insertLog(`${id}`, "Update", "Users", req.user.id, email);
        return res.status(200).json({
            status: 200,
            message: "User has been updated successfully",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Update",
            "Users",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const listAllFlitexMasterUsers = async (req, res) => {
    try {
        const status = req.query.status;
        const page = parseInt(req.query.page);
        const currentUser = req.user.id;
        const pageSize = parseInt(req.query.pageSize);
        const offset = (page - 1) * pageSize;
        const searchValue = req.query.searchValue || null;
        const result = await sequelize.query(
            "EXEC listOfFlitexMasterUserData @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @currentUser = :currentUser, @status = :status",
            {
                replacements: {
                    offset: offset ? offset : 0,
                    pageSize: pageSize || null,
                    searchValue: searchValue,
                    currentUser: currentUser,
                    status: status == "all" ? null : status,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        return res.status(200).json({
            status: 200,
            message: searchValue
                ? "User data Search successfully"
                : "User data fetched successfully",
            data: result,
            totalRecords: result[0][0]?.totalRecords
                ? result[0][0]?.totalRecords
                : 0,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "List",
            "Users",
            req.user.id,
            req.user.email
        );
        return res.status(500).json({
            status: 500,
            message: "Something went wrong. Please try again later",
        });
    }
};

const deleteFlitexMasterUser = async (req, res) => {
    try {
        const id = req.params.id;
        const getFlitexMasterUser = await flitexMasterUsersModel.findByPk(id);
        await sequelize.query("EXEC deleteFlitexMasterUserData @id = :id", {
            replacements: {
                id: id,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        await imageRemove(getFlitexMasterUser.profilePic);
        insertLog(
            `${id}`,
            "Delete",
            "Users",
            req.user.id,
            getFlitexMasterUser.email
        );
        return res.status(200).json({
            status: 200,
            message: "User has been deleted successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Delete",
            "Users",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const getFlitexMasterById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await sequelize.query(
            "EXEC getFlitexMasterUserById @id = :id",
            {
                replacements: {
                    id: id,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        return res.status(200).json({
            status: 200,
            message: "User data fetch successfully",
            data: result,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "getById",
            "Users",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const updateFlitexMasterUserStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await flitexMasterUsersModel.findByPk(id);
        const isActive = !req.body.isActive;
        if (user) {
            await sequelize.query(
                "UPDATE flitex_master_user SET isActive = :isActive WHERE id = :id",
                {
                    replacements: { isActive, id },
                    type: sequelize.QueryTypes.UPDATE,
                }
            );
            insertLog(
                `${id}`,
                "Update Status",
                "Users",
                req.user.id,
                user.isActive
            );
            return res.status(200).json({
                status: 200,
                message: "User status has been updated successfully.",
            });
        } else {
            return res.status(200).json({
                status: 200,
                message: "User is not exists",
            });
        }
    } catch (error) {
        createErrorLog(
            error.message,
            "Update Status",
            "Users",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const deleteMultipleFlitexMasterUser = async (req, res) => {
    try {
        let data = req.body.id;
        if (!Array.isArray(data)) {
            data = [data];
        }
        const getFlitexMasterUser = await flitexMasterUsersModel.findAll({
            where: {
                id: data,
            },
        });
        await sequelize.query("EXEC deleteFlitexMasterUserData @id = :id", {
            replacements: {
                id: data.join(","),
            },
            type: Sequelize.QueryTypes.RAW,
        });
        getFlitexMasterUser.forEach(
            async (entity) => await imageRemove(entity.profilePic)
        );
        insertLog(
            `${data}`,
            "Multiple Delete",
            "Users",
            req.user.id,
            getFlitexMasterUser.map((item) => item.email)
        );
        return res.status(200).json({
            status: 200,
            message: "User has been deletd successfully.",
        });
    } catch (error) {
        console.log("errorerror", error);
        createErrorLog(
            error.message,
            "Multiple Delete",
            "Users",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const exportFlitexMasterUserData = async (req, res) => {
    try {
        const { ids } = req.body;
        let getUser;
        if (ids === "all") {
            getUser = await sequelize.query(
                "EXEC listOfFlitexMasterUserData @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @currentUser = :currentUser, @status = :status",
                {
                    replacements: {
                        offset: 0,
                        pageSize: null,
                        searchValue: null,
                        currentUser: req.user.id,
                        status: null,
                    },
                    type: Sequelize.QueryTypes.RAW,
                }
            );
        } else {
            // Retrieve specific records based on the provided IDs
            getUser = await sequelize.query(
                "EXEC getFlitexMasterUserById @id = :id",
                {
                    replacements: {
                        id: ids.join(),
                    },
                    type: Sequelize.QueryTypes.RAW,
                }
            );
        }

        const data = getUser[0].map((user) => {
            return {
                id: { label: "ID", value: user.id },
                firstName: { label: "First Name", value: user.firstName },
                lastName: { label: "Last Name", value: user.lastName },
                email: { label: "Email", value: user.email },
                isActive: { label: "Is Active", value: user.isActive },
            };
        });

        const title = "Flitex Master User Data";
        const fileName = "flitexMasterUser.xlsx";
        const filePath = await generateExcelData(data, title, fileName);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=flitexMasterUser.xlsx`
        );

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        // Delete the temporary file after streaming
        fileStream.on("end", () => {
            fs.unlinkSync(filePath);
        });
        insertLog("-", "Export", "Users", req.user.id, "-");
    } catch (error) {
        createErrorLog(
            error.message,
            "Export",
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
    createFlitexMasterUser,
    updateFlitexMasterUser,
    listAllFlitexMasterUsers,
    deleteFlitexMasterUser,
    getFlitexMasterById,
    updateFlitexMasterUserStatus,
    deleteMultipleFlitexMasterUser,
    exportFlitexMasterUserData,
};
