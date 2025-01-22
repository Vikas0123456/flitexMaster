const { sequelize } = require("../config/connection");
const { Sequelize } = require("sequelize");
const Table1Model = require("../models/testModel");
const fliteRevUsers = require("../models/fliteRevUserModel");
const { sendFliteRevUserCreationEmail } = require("./emailController");
const { insertLog } = require("../controllers/systemLogController");
const bcrypt = require("bcryptjs");
const { imageRemove, generateExcelData } = require("../utiles/commonFunction");
const { createErrorLog } = require("../utiles/logmanager/logger");
const fs = require("fs");

const createUser = async (req, res) => {
    try {
        const {
            userName,
            firstName,
            lastName,
            email,
            password,
            domain,
            isActive,
            airlineIds,
        } = req.body;
        const databaseName = `${userName}_fliterev_${new Date().getTime()}`;
        const workFactor = 8;
        const hashPassword = await bcrypt.hash(password, workFactor);

        const checkIsExistsOrNot = await sequelize.query(
            `SELECT * FROM flite_rev_user WHERE email = '${email}' OR userName = '${userName}'`
        );

        if (checkIsExistsOrNot[0].length > 0) {
            return res.status(202).json({
                status: 202,
                message:
                    "Username or Email is already exists. Please try different credintials",
            });
        }
        const airlineIdsArray = airlineIds
            .split(",")
            .map((id) => parseInt(id.trim()));

        const result = await sequelize.query(
            "EXEC insertFliteRevUserData @userName = :userName, @firstName = :firstName, @lastName = :lastName, @email = :email, @password = :password, @databaseName = :databaseName,  @domain = :domain, @profilePic = :profilePic, @isActive = :isActive, @airlineIds = :airlineIds",
            {
                replacements: {
                    userName: userName,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: hashPassword,
                    databaseName: databaseName,
                    domain: domain,
                    profilePic: req.file.filename,
                    isActive: isActive,
                    airlineIds: airlineIdsArray.join(","),
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );

        const dbCreation = await sequelize.query(
            `CREATE DATABASE ${databaseName}`
        );
        const databaseConnection = new Sequelize(
            databaseName,
            process.env.USER,
            process.env.PASSWORD,
            {
                host: process.env.HOST,
                dialect: "mssql",
                timestamps: true,
            }
        );
        await databaseConnection.authenticate();

        const Table1 = Table1Model(databaseConnection);

        await databaseConnection.sync({ force: true }); // Use force: true to drop existing tables

        await sendFliteRevUserCreationEmail(userName, email, password, domain);
        insertLog(
            `${result[0][0].flitrevUserId}`,
            "Insert",
            "fliteRev User",
            req.user.id,
            userName
        );
        return res.status(200).json({
            status: 200,
            message: "User has been created successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Insert",
            "fliteRev User",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const getFliteRevUser = await fliteRevUsers.findByPk(id);
        const {
            userName,
            firstName,
            lastName,
            email,
            password,
            isActive,
            isImageEdited,
            isPasswordEdited,
            airlineIds,
        } = req.body;
        const isEdit = isImageEdited == "true" ? true : false;
        const isEditPassword = isPasswordEdited == "true" ? true : false;

        const workFactor = 8;
        let hashPassword = null;
        if (isEditPassword) {
            hashPassword = await bcrypt.hash(password, workFactor);
        }

        const airlineIdsArray = airlineIds
            .split(",")
            .map((id) => parseInt(id.trim()));

        let query =
            "EXEC updateFliteRevUserData @id = :id, @userName = :userName, @firstName = :firstName, @lastName = :lastName, @email = :email, @password = :password, @isActive = :isActive, @profilePic = :profilePic, @airlineIds = :airlineIds";

        const result = await sequelize.query(query, {
            replacements: {
                id: id,
                userName: userName,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: isEditPassword ? hashPassword : password,
                profilePic: isEdit ? req.file.filename : req.body.filename,
                isActive: isActive,
                airlineIds: airlineIdsArray.join(","),
            },
            type: Sequelize.QueryTypes.RAW,
        });
        if (isEdit) {
            await imageRemove(getFliteRevUser.profilePic);
        }
        insertLog(`${id}`, "Update", "fliteRev User", req.user.id, userName);
        return res.status(200).json({
            status: 200,
            message: "User has been updated successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Update",
            "fliteRev User",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const listAllUsers = async (req, res) => {
    try {
        const status = req.query.status;
        const page = parseInt(req.query.page);
        const pageSize = parseInt(req.query.pageSize);
        const offset = (page - 1) * pageSize;
        const searchValue = req.query.searchValue;
        const result = await sequelize.query(
            "EXEC listOfFliteRevUserData @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @status = :status",
            {
                replacements: {
                    offset: offset,
                    pageSize: pageSize,
                    searchValue: searchValue ? searchValue : null,
                    status: status == "all" ? null : status,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        return res.status(200).json({
            status: 200,
            message: searchValue
                ? "User results retrieved successfully."
                : "User retrieved successfully.",
            data: result,
            totalRecords: result[0][0]?.totalRecords
                ? result[0][0]?.totalRecords
                : 0,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "List",
            "fliteRev User",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const getFliteRevUser = await fliteRevUsers.findByPk(id);
        await sequelize.query("EXEC deleteFliteRevUserData @id = :id", {
            replacements: {
                id: id,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        await imageRemove(getFliteRevUser.profilePic);
        insertLog(
            `${id}`,
            "Delete",
            "fliteRev User",
            req.user.id,
            getFliteRevUser.userName
        );
        return res.status(200).json({
            status: 200,
            message: "User deleted successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Delete",
            "fliteRev User",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await sequelize.query(
            "EXEC getFliteRevUserById @id = :id",
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
            "fliteRev User",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await fliteRevUsers.findByPk(id);
        const isActive = !req.body.isActive;
        if (user) {
            await sequelize.query(
                "UPDATE flite_rev_user SET isActive = :isActive WHERE id = :id",
                {
                    replacements: { isActive, id },
                    type: sequelize.QueryTypes.UPDATE,
                }
            );
            insertLog(
                `${id}`,
                "Update Status",
                "fliteRev User",
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
            "fliteRev User",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const deleteMultipleUser = async (req, res) => {
    try {
        let data = req.body;
        if (!Array.isArray(data)) {
            data = [data];
        }
        const getFliteRevUser = await fliteRevUsers.findAll({
            where: {
                id: data,
            },
        });
        await sequelize.query("EXEC deleteFliteRevUserData @id = :id", {
            replacements: {
                id: data.join(","),
            },
            type: Sequelize.QueryTypes.RAW,
        });
        getFliteRevUser.forEach(
            async (entity) => await imageRemove(entity.profilePic)
        );
        insertLog(
            `${data}`,
            "Multiple Delete",
            "fliteRev User",
            req.user.id,
            getFliteRevUser.map((item) => item.userName)
        );
        return res.status(200).json({
            status: 200,
            message: "User has been deleted successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Multiple Delete",
            "fliteRev User",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const exportFlitexRevUserData = async (req, res) => {
    try {
        const { ids } = req.body;
        let getUser;
        if (ids === "all") {
            getUser = await sequelize.query(
                "EXEC listOfFliteRevUserData @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @status = :status",
                {
                    replacements: {
                        offset: 0,
                        pageSize: null,
                        searchValue: null,
                        status: null,
                    },
                    type: Sequelize.QueryTypes.RAW,
                }
            );
        } else {
            // Retrieve specific records based on the provided IDs
            getUser = await sequelize.query(
                "EXEC getFliteRevUserById @id = :id",
                {
                    replacements: {
                        id: ids.join(),
                    },
                    type: Sequelize.QueryTypes.RAW,
                }
            );
        }

        const data = getUser[0].map((user) => {
            let airlineNames = [];
            if (user.airlineNames) {
                if (Array.isArray(user.airlineNames)) {
                    // If airlineNames is an array, use it directly
                    airlineNames = user.airlineNames;
                } else {
                    // If airlineNames is a single value, convert it to an array
                    airlineNames = [user.airlineNames];
                }
            }
            const formattedAirlineName = airlineNames
                .map((airline, index) => `${airline}`)
                .join("\n");
            return {
                id: { label: "ID", value: user.id },
                userName: { label: "User Name", value: user.userName },
                email: { label: "Email", value: user.email },
                domin: { label: "Domain", value: user.domain },
                airlineNames: {
                    label: "Airline Names",
                    value: formattedAirlineName,
                },
                isActive: { label: "Is Active", value: user.isActive },
            };
        });

        const title = "Flitex Rev User Data";
        const fileName = "fliteRevUser.xlsx";
        const filePath = await generateExcelData(data, title, fileName);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=fliteRevUser.xlsx`
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
    createUser,
    updateUser,
    listAllUsers,
    deleteUser,
    getUserById,
    updateUserStatus,
    deleteMultipleUser,
    exportFlitexRevUserData,
};
