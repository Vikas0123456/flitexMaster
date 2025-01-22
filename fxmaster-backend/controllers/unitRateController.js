const { Sequelize, sequelize } = require("../config/connection");
const { createErrorLog } = require("../utiles/logmanager/logger");
const { insertLog } = require("../controllers/systemLogController");
const unitRatesModel = require("../models/unitRateModel");
const { Op } = require("sequelize");
const fs = require("fs");
const { generateExcelData } = require("../utiles/commonFunction");

const createUnitRates = async (req, res) => {
    try {
        const {
            countryCode,
            dateFrom,
            dateTo,
            unitRate,
            currency,
            countryId,
            isActive,
        } = req.body;
        const result = await sequelize.query(
            "EXEC InsertUnitRatesData @countryCode = :countryCode, @dateFrom = :dateFrom, @dateTo = :dateTo, @unitRate = :unitRate, @currency = :currency, @countryId = :countryId, @isActive = :isActive",
            {
                replacements: {
                    countryCode: countryCode,
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    unitRate: unitRate,
                    currency: currency,
                    countryId: countryId,
                    isActive: isActive,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        insertLog(
            `${result[0][0].unitRateId}`,
            "Insert",
            "Unit Rate",
            req.user.id,
            unitRate
        );
        return res.status(200).json({
            status: 200,
            message: "UnitRate has been created successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Insert",
            "Unit Rate",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const updateUniteRates = async (req, res) => {
    try {
        const {
            countryCode,
            dateFrom,
            dateTo,
            unitRate,
            currency,
            countryId,
            isActive,
        } = req.body;
        const id = req.params.id;
        await sequelize.query(
            "EXEC updateUnitRatesData @id = :id, @countryCode = :countryCode, @dateFrom = :dateFrom, @dateTo = :dateTo, @unitRate = :unitRate, @currency = :currency, @countryId = :countryId, @isActive = :isActive",
            {
                replacements: {
                    id: id,
                    countryCode: countryCode,
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    unitRate: unitRate,
                    currency: currency,
                    countryId: countryId,
                    isActive: isActive,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        insertLog(`${id}`, "Update", "Unit Rate", req.user.id, unitRate);
        return res.status(200).json({
            status: 200,
            message: "UnitRate has been updated successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Update",
            "Unit Rate",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const listUnitRates = async (req, res) => {
    try {
        const status = req.query.status;
        const page = parseInt(req.query.page);
        const pageSize = parseInt(req.query.pageSize);
        const offset = (page - 1) * pageSize;
        const searchValue = req.query.searchValue;
        const result = await sequelize.query(
            "EXEC listOfAllUnitRates @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @status = :status",
            {
                replacements: {
                    offset: offset ? offset : 0,
                    pageSize: pageSize ? pageSize : null,
                    searchValue: searchValue ? searchValue : null,
                    status: status == "all" ? null : status,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        return res.status(200).json({
            status: 200,
            message: searchValue
                ? "UnitRates results retrieved successfully."
                : "UnitRates retrieved successfully.",
            data: result,
            totalRecords: result[0][0]?.totalRecords
                ? result[0][0]?.totalRecords
                : 0,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "List",
            "Unit Rate",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const deleteUnitRates = async (req, res) => {
    try {
        const id = req.params.id;
        const getUnitRate = await unitRatesModel.findByPk(id);
        await sequelize.query("EXEC deleteUnitRatesData @id = :id", {
            replacements: {
                id: id,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        insertLog(
            `${id}`,
            "Delete",
            "Unit Rate",
            req.user.id,
            getUnitRate.unitRate
        );
        return res.status(200).json({
            status: 200,
            message: "UnitRate has been deletd successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Delete",
            "Unit Rate",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const getUnitRateById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await sequelize.query("EXEC getUnitRateById @id = :id", {
            replacements: {
                id: id,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        return res.status(200).json({
            status: 200,
            message: "Country retrieved successfully.",
            data: result,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "getById",
            "Unit Rate",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const deleteMultipleUnitRates = async (req, res) => {
    try {
        let data = req.body.id;
        const getUnitRate = await unitRatesModel.findAll({
            where: {
                id: {
                    [Op.in]: data,
                },
            },
        });
        if (Array.isArray(data)) {
            data = data.join(",");
        }
        await sequelize.query("EXEC deleteUnitRatesData @id = :id", {
            replacements: {
                id: data,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        insertLog(
            `${data}`,
            "Multiple Delete",
            "Unit Rate",
            req.user.id,
            getUnitRate.map((item) => item.unitRate)
        );
        return res.status(200).json({
            status: 200,
            message: "UnitRate has been deletd successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Multiple Delete",
            "Unit Rate",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const updateUnitRateStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const unitRate = await unitRatesModel.findByPk(id);
        const isActive = !req.body.isActive;
        if (unitRate) {
            await sequelize.query(
                "UPDATE unit_rate SET isActive = :isActive WHERE id = :id",
                {
                    replacements: { isActive, id },
                    type: sequelize.QueryTypes.UPDATE,
                }
            );
            insertLog(
                `${id}`,
                "Update Status",
                "Unit Rate",
                req.user.id,
                unitRate.isActive
            );
            return res.status(200).json({
                status: 200,
                message: "Unit Rate status has been updated successfully.",
            });
        } else {
            return res.status(200).json({
                status: 200,
                message: "Unit Rate is not exists",
            });
        }
    } catch (error) {
        createErrorLog(
            error.message,
            "Update Status",
            "Unit Rate",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};
const exportUnitRateData = async (req, res) => {
    try {
        const { ids } = req.body;
        let getUnitRate;
        if (ids === "all") {
            getUnitRate = await sequelize.query(
                "EXEC listOfAllUnitRates @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @status = :status",
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
            getUnitRate = await sequelize.query(
                "EXEC getUnitRateById @id = :id",
                {
                    replacements: {
                        id: ids.join(),
                    },
                    type: Sequelize.QueryTypes.RAW,
                }
            );
        }

        const data = getUnitRate[0].map((unitRate) => {
            return {
                id: { label: "ID", value: unitRate.id },
                countryName: {
                    label: "Country Name",
                    value: unitRate.countryName,
                },
                countryCode: {
                    label: "Country Code",
                    value: unitRate.countryCode,
                },
                currency: { label: "Currency", value: unitRate.currency },
                unitRate: { label: "Unit Rate", value: unitRate.unitRate },
                dateFrom: { label: "Date From", value: unitRate.dateFrom },
                dateTo: { label: "Date To", value: unitRate.dateTo },
                isActive: { label: "Is Active", value: unitRate.isActive },
            };
        });

        const title = "Unit Rate Data";
        const fileName = "unitRate.xlsx";
        const filePath = await generateExcelData(data, title, fileName);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", `attachment; filename=ansp.xlsx`);

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        // Delete the temporary file after streaming
        fileStream.on("end", () => {
            fs.unlinkSync(filePath);
        });
        insertLog("-", "Export", "Unit Rate", req.user.id, "-");
    } catch (error) {
        createErrorLog(
            error.message,
            "Export",
            "Unit Rate",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

module.exports = {
    createUnitRates,
    updateUniteRates,
    listUnitRates,
    deleteUnitRates,
    getUnitRateById,
    updateUnitRateStatus,
    deleteMultipleUnitRates,
    exportUnitRateData,
};
