const { Sequelize, sequelize } = require("../config/connection");
const {
    formatedDateAndTime,
    generateExcelData,
} = require("../utiles/commonFunction");
const { createErrorLog } = require("../utiles/logmanager/logger");
var os = require("os");
const moment = require("moment");
const fs = require("fs");
const flitexMasterUsersModel = require("../models/fliteXMasterUserModel");

const insertLog = async (recordId, action, moduleName, userId, recordValue) => {
    try {
        const interfaces = os.networkInterfaces();
        let ipAddress = null;

        for (const k in interfaces) {
            for (const k2 in interfaces[k]) {
                const address = interfaces[k][k2];
                if (address.family === "IPv4" && !address.internal) {
                    ipAddress = address.address;
                    break;
                }
            }
            if (ipAddress) {
                break;
            }
        }
        const result = await sequelize.query(
            "EXEC addLogData @recordId = :recordId, @action = :action, @moduleName = :moduleName, @userId = :userId, @ipAddress= :ipAddress, @recordValue = :recordValue",
            {
                replacements: {
                    recordId: recordId,
                    action: action,
                    moduleName: moduleName,
                    userId: userId,
                    ipAddress: ipAddress,
                    recordValue: recordValue.toString(),
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        return result.data;
    } catch (error) {
        throw new Error(error);
    }
};

const deleteLog = async (req, res) => {
    try {
        const id = req.params.id;
        await sequelize.query("EXEC deleteSystemLogData @id = :id", {
            replacements: {
                id: id,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        return res.status(200).json({
            status: 200,
            message: "System log has been deleted successfully.",
        });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const deleteMultipleLogs = async (req, res) => {
    try {
        let data = req.body.id;
        data = data.join(",");
        await sequelize.query("EXEC deleteSystemLogData @id = :id", {
            replacements: {
                id: data,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        return res.status(200).json({
            status: 200,
            message: "System logs has been deleted successfully.",
        });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const filterSystemLog = async (req, res) => {
    try {
        const {
            startDate,
            endDate,
            searchValue,
            userOperation,
            moduleName,
            userNameFilter,
        } = req.query;
        let fromDate;
        let toDate;
        const dateString = new Date();
        const formattedDate = moment(dateString).format(
            "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
        );
        let userId = userNameFilter;
        if (userNameFilter == 0) {
            const data = await sequelize.query(
                `SELECT userId FROM system_log GROUP BY userId `
            );
            userId = data[0].map((f) => f.userId).join(",");
        }
        console.log("userIduserId", userId);
        fromDate = startDate ? startDate : formattedDate;
        toDate = endDate ? endDate : formattedDate;
        const page = parseInt(req.query.page);
        const pageSize = parseInt(req.query.pageSize);
        const offset = (page - 1) * pageSize;
        const result = await sequelize.query(
            "EXEC filterSystemLog @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @startDate = :startDate, @endDate = :endDate, @userOperation = :userOperation, @moduleName = :moduleName, @userId = :userId",
            {
                replacements: {
                    offset: offset ? offset : 0,
                    pageSize: pageSize ? pageSize : null,
                    startDate: fromDate ? fromDate : null,
                    searchValue: searchValue ? searchValue : null,
                    endDate: toDate ? toDate : null,
                    userOperation:
                        userOperation == "all" ? null : userOperation,
                    moduleName: moduleName == "all" ? null : moduleName,
                    userId: userId,
                },
            }
        );
        const formatedResponse = result[0].map((item) => {
            return {
                ...item,
                dateAndTime: formatedDateAndTime(item.dateAndTime),
            };
        });
        return res.status(200).json({
            status: 200,
            message: "Log retrieved successfully.",
            data: formatedResponse,
            totalRecords: result[0][0]?.totalRecords
                ? result[0][0]?.totalRecords
                : 0,
        });
    } catch (error) {
        console.log("error", error);
        createErrorLog(
            error.message,
            "filterSystemLog",
            "System Log",
            req.user.id,
            req.user.email
        );
        return res.status(500).json({
            message: "Something went wrong. Please try again later",
        });
    }
};

const getDashboardData = async (req, res) => {
    try {
        const pieChartData = await sequelize.query("EXEC getChartPercentage", {
            type: Sequelize.QueryTypes.RAW,
        });
        const aircraftData = await sequelize.query("EXEC listOfAircraftData", {
            type: Sequelize.QueryTypes.RAW,
        });
        const airlineData = await sequelize.query("EXEC listOfAirlineData", {
            type: Sequelize.QueryTypes.RAW,
        });
        const countryData = await sequelize.query("EXEC listOfCountryData", {
            type: Sequelize.QueryTypes.RAW,
        });
        const anspData = await sequelize.query("EXEC listOfAnspData", {
            type: Sequelize.QueryTypes.RAW,
        });
        const mtowData = await sequelize.query("EXEC listOfMtowData", {
            type: Sequelize.QueryTypes.RAW,
        });
        const currencyData = await sequelize.query(
            "EXEC listOfCurrencyManagerData",
            {
                type: Sequelize.QueryTypes.RAW,
            }
        );
        return res.status(200).json({
            status: 200,
            message: "Dashboard retrieved successfully.",
            data: {
                pieChartData: pieChartData ? pieChartData : [],
                totalAircraft: aircraftData[0][0]?.totalRecords
                    ? aircraftData[0][0].totalRecords
                    : 0,
                totalAiline: airlineData[0][0]?.totalRecords
                    ? airlineData[0][0].totalRecords
                    : 0,
                totalCountry: countryData[0][0]?.totalRecords
                    ? countryData[0][0].totalRecords
                    : 0,
                totalAnsp: anspData[0][0]?.totalRecords
                    ? anspData[0][0].totalRecords
                    : 0,
                mtow: mtowData[0] ? mtowData[0] : [],
                currency: currencyData ? currencyData : [],
            },
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "List",
            "Dashboard",
            req.user.id,
            req.user.email
        );
        return res.status(500).json({
            message: "Something went wrong. Please try again later",
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await flitexMasterUsersModel.findAll({
            where: {
                isActive: true,
                isDeleted: false,
            },
        });
        return res.status(200).json({
            status: 200,
            message: "Dashboard retrieved successfully.",
            data: users,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "List",
            "Dashboard",
            req.user.id,
            req.user.email
        );
        return res.status(500).json({
            message: "Something went wrong. Please try again later",
        });
    }
};

const exportSystemLogData = async (req, res) => {
    try {
        const {
            startDate,
            endDate,
            searchValue,
            userOperation,
            moduleName,
            userNameFilter,
        } = req.query;
        let fromDate;
        let toDate;
        const dateString = new Date();
        const formattedDate = moment(dateString).format(
            "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
        );
        let userId = userNameFilter;
        if (userNameFilter == 0) {
            const data = await sequelize.query(
                `SELECT userId FROM system_log GROUP BY userId `
            );
            userId = data[0].map((f) => f.userId).join(",");
        }
        fromDate = startDate ? startDate : formattedDate;
        toDate = endDate ? endDate : formattedDate;
        const { ids } = req.body;
        let getSystemLog;
        if (ids === "all") {
            getSystemLog = await sequelize.query(
                "EXEC filterSystemLog @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @startDate = :startDate, @endDate = :endDate, @userOperation = :userOperation, @moduleName = :moduleName, @userId = :userId",
                {
                    replacements: {
                        offset: null,
                        pageSize: null,
                        startDate: fromDate ? fromDate : null,
                        searchValue: searchValue ? searchValue : null,
                        endDate: toDate ? toDate : null,
                        userOperation:
                            userOperation == "all" ? null : userOperation,
                        moduleName: moduleName == "all" ? null : moduleName,
                        userId: userId,
                    },
                }
            );
        } else {
            getSystemLog = await sequelize.query(
                "EXEC getSystemLogById @id = :id",
                {
                    replacements: {
                        id: ids.join(),
                    },
                    type: Sequelize.QueryTypes.RAW,
                }
            );
        }
        const data = getSystemLog[0].map((log) => {
            const fullName =
                log.firstName && log.lastName
                    ? `${log.firstName} ${log.lastName}`
                    : "-";
            return {
                id: { label: "ID", value: log.id },
                moduleName: { label: "Module Name", value: log.moduleName },
                action: { label: "User Operation", value: log.action },
                recordValue: { label: "Record Value", value: log.recordValue },
                userName: { label: "User Name", value: fullName },
                ipAddress: { label: "IP Address", value: log.ipAddress },
                dateAndTime: { label: "Date And Time", value: log.dateAndTime },
            };
        });

        const title = "System Log Data";
        const fileName = "systemLog.xlsx";
        const filePath = await generateExcelData(data, title, fileName);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=systemLog.xlsx`
        );

        // Stream the file to the response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on("end", () => {
            fs.unlinkSync(filePath);
        });
        insertLog(`-`, "Export", "System Log", req.user.id, "-");
    } catch (error) {
        createErrorLog(
            error.message,
            "Export",
            "System Log",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

module.exports = {
    insertLog,
    deleteLog,
    deleteMultipleLogs,
    filterSystemLog,
    getDashboardData,
    getAllUsers,
    exportSystemLogData,
};
