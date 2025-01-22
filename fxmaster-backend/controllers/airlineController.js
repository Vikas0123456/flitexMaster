const { Sequelize, sequelize } = require("../config/connection");
const { createErrorLog } = require("../utiles/logmanager/logger");
const { insertLog } = require("../controllers/systemLogController");
const airlines = require("../models/airlineModel");
const {
    imageRemove,
    encryptData,
    decryptData,
    generateExcelData,
} = require("../utiles/commonFunction");
const fs = require("fs");

const createAirline = async (req, res) => {
    try {
        const {
            callSign,
            countryId,
            iata,
            airlineName,
            personDetail,
            address,
            bankAccount,
            bankName,
            swiftCode,
            isActive,
        } = req.body;
        const encryptedBankName = await encryptData(bankName);
        const encryptedAccountNumber = await encryptData(bankAccount);
        const encryptSwiftCode = await encryptData(swiftCode);
        if (
            !encryptedBankName &&
            !encryptedAccountNumber &&
            !encryptSwiftCode
        ) {
            return res
                .status(400)
                .json({ status: 400, message: "Data was not encryptd" });
        }
        const result = await sequelize.query(
            "EXEC insertAirlineData @callSign = :callSign, @countryId = :countryId, @iata = :iata, @airlineName = :airlineName, @airlineLogo = :airlineLogo, @personDetail = :personDetail, @address = :address, @bankAccount = :bankAccount, @bankName = :bankName, @swiftCode = :swiftCode, @isActive = :isActive",
            {
                replacements: {
                    callSign: callSign,
                    countryId: countryId,
                    iata: iata,
                    airlineName: airlineName,
                    airlineLogo: req.file?.filename || null,
                    personDetail: personDetail,
                    address: address,
                    bankAccount: encryptedAccountNumber,
                    bankName: encryptedBankName,
                    swiftCode: encryptSwiftCode,
                    isActive: isActive,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        insertLog(
            `${result[0][0].airlineId}`,
            "Insert",
            "Airline",
            req.user.id,
            airlineName
        );
        return res.status(200).json({
            status: 200,
            message: "Airline has been created successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Insert",
            "Airline",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try again later" });
    }
};

const updateAirline = async (req, res) => {
    try {
        const id = req.params.id;
        const getAirline = await airlines.findByPk(id);
        const {
            callSign,
            countryId,
            iata,
            airlineName,
            personDetail,
            address,
            bankAccount,
            bankName,
            swiftCode,
            isActive,
        } = req.body;
        const encryptedBankName = await encryptData(bankName);
        const encryptedAccountNumber = await encryptData(bankAccount);
        const encryptSwiftCode = await encryptData(swiftCode);
        if (
            !encryptedBankName &&
            !encryptedAccountNumber &&
            !encryptSwiftCode
        ) {
            return res
                .status(400)
                .json({ status: 400, message: "Data was not encryptd" });
        }
        await sequelize.query(
            "EXEC updateAirlineData @id = :id, @callSign = :callSign, @countryId = :countryId, @iata = :iata, @airlineName = :airlineName, @airlineLogo = :airlineLogo, @personDetail = :personDetail, @address = :address, @bankAccount = :bankAccount, @bankName = :bankName, @swiftCode = :swiftCode, @isActive = :isActive",
            {
                replacements: {
                    id: id,
                    countryId: countryId,
                    callSign: callSign,
                    iata: iata,
                    airlineName: airlineName,
                    airlineLogo: req.file ? req.file.filename : null,
                    personDetail: personDetail,
                    address: address,
                    bankAccount: encryptedAccountNumber,
                    bankName: encryptedBankName,
                    swiftCode: encryptSwiftCode,
                    isActive: isActive,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        if (req.file) {
            await imageRemove(getAirline.airlineLogo);
        }
        insertLog(
            `${id}`,
            "Update",
            "Airline",
            req.user.id,
            getAirline.airlineName
        );
        return res.status(200).json({
            status: 200,
            message: "Airline has been updated successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Update",
            "Airline",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try again later" });
    }
};

const listAirline = async (req, res) => {
    try {
        let { status, page, pageSize, searchValue } = req.query;
        if (status === undefined) {
            status = null;
        }
        const offset = page && pageSize ? (page - 1) * pageSize : 0;
        const result = await sequelize.query(
            "EXEC listOfAirlineData @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @status = :status",
            {
                replacements: {
                    offset: offset,
                    pageSize: pageSize ? pageSize : null,
                    searchValue: searchValue ? searchValue : null,
                    status: status == "all" ? null : status,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        const decryptedData = result[0].map((item) => {
            return {
                ...item,
                swiftCode: decryptData(item.swiftCode),
                bankName: decryptData(item.bankName),
                bankAccount: decryptData(item.bankAccount),
            };
        });
        return res.status(200).json({
            status: 200,
            message: searchValue
                ? "Airline results retrieved successfully."
                : "Airline retrieved successfully.",
            data: decryptedData,
            totalRecords: result[0][0]?.totalRecords
                ? result[0][0]?.totalRecords
                : 0,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "List",
            "Airline",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const deleteAirline = async (req, res) => {
    try {
        const id = req.params.id;
        const getAirline = await airlines.findByPk(id);
        await sequelize.query("EXEC deleteAirlineData @id = :id", {
            replacements: {
                id: id,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        await imageRemove(getAirline.airlineLogo);
        insertLog(
            `${id}`,
            "Delete",
            "Airline",
            req.user.id,
            getAirline.airlineName
        );
        return res.status(200).json({
            status: 200,
            message: "Airline has been deleted successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Delete",
            "Airline",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const getAirlineById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await sequelize.query("EXEC getAirlineById @id = :id", {
            replacements: {
                id: id,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        const decryptedData = result[0].map((item) => {
            return {
                ...item,
                swiftCode: decryptData(item.swiftCode),
                bankName: decryptData(item.bankName),
                bankAccount: decryptData(item.bankAccount),
            };
        });
        return res.status(200).json({
            status: 200,
            message: "Airline retrieved successfully.",
            data: decryptedData,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "getById",
            "Airline",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const deleteMultipleAirline = async (req, res) => {
    try {
        let data = req.body.id;
        const getAirline = await airlines.findAll({
            where: {
                id: data,
            },
        });
        data = data.join(",");
        await sequelize.query("EXEC deleteAirlineData @id = :id", {
            replacements: {
                id: data,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        getAirline.forEach(
            async (entity) => await imageRemove(entity.airlineLogo)
        );
        insertLog(
            `${data}`,
            "Multiple Delete",
            "Airline",
            req.user.id,
            getAirline.map((item) => item.airlineName)
        );
        return res.status(200).json({
            status: 200,
            message: "Airline has been deleted successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Multiple Delete",
            "Airline",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const updateAirlineStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const airline = await airlines.findByPk(id);
        const isActive = !req.body.isActive;
        if (airline) {
            await sequelize.query(
                "UPDATE airline SET isActive = :isActive WHERE id = :id",
                {
                    replacements: { isActive, id },
                    type: sequelize.QueryTypes.UPDATE,
                }
            );
            insertLog(
                `${id}`,
                "Update Status",
                "Airline",
                req.user.id,
                airline.isActive
            );
            return res.status(200).json({
                status: 200,
                message: "Airline status has been updated successfully.",
            });
        } else {
            createErrorLog(
                error.message,
                "Update Status",
                "Airline",
                req.user.id,
                req.user.email
            );
            return res.status(200).json({
                status: 200,
                message: "Airline is not exists",
            });
        }
    } catch (error) {
        createErrorLog(
            error.message,
            "Update Status",
            "Airline",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const exportAirlineData = async (req, res) => {
    try {
        const { ids } = req.body;
        let getAirline;
        if (ids === "all") {
            getAirline = await sequelize.query(
                "EXEC listOfAirlineData @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @status = :status",
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
            getAirline = await sequelize.query(
                "EXEC getAirlineById @id = :id",
                {
                    replacements: {
                        id: ids.join(),
                    },
                    type: Sequelize.QueryTypes.RAW,
                }
            );
        }
        const data = getAirline[0].map((airline) => {
            const personalDetails = JSON.parse(airline.personDetail);

            // Format personalDetails as a string with line breaks
            const formattedDetails = personalDetails
                .map((detail, index) => {
                    return `${index + 1}. Name: ${detail.name}, Email: ${
                        detail.email
                    }, Contact Number: ${detail.contactNumber}`;
                })
                .join("\n");
            return {
                id: { label: "ID", value: airline.id },
                callSign: { label: "Call Sign", value: airline.callSign },
                iata: { label: "Iata", value: airline.iata },
                airlineName: {
                    label: "Airline Name",
                    value: airline.airlineName,
                },
                personDetail: {
                    label: "Personal Detail",
                    value: formattedDetails,
                },
                address: { label: "Address", value: airline.address },
                countryName: {
                    label: "Country Name",
                    value: airline.countryName,
                },
                isActive: { label: "Is Active", value: airline.isActive },
            };
        });

        const title = "Airline Data";
        const fileName = "airline.xlsx";
        const filePath = await generateExcelData(data, title, fileName);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=airline.xlsx`
        );

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        // Delete the temporary file after streaming
        fileStream.on("end", () => {
            fs.unlinkSync(filePath);
        });
        insertLog("-", "Export", "Airline", req.user.id, "-");
    } catch (error) {
        createErrorLog(
            error.message,
            "Export",
            "Airline",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

module.exports = {
    createAirline,
    updateAirline,
    listAirline,
    deleteAirline,
    getAirlineById,
    deleteMultipleAirline,
    updateAirlineStatus,
    exportAirlineData,
};
