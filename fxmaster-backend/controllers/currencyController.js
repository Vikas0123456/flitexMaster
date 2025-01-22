const { sequelize, Sequelize } = require("../config/connection");
const { createErrorLog } = require("../utiles/logmanager/logger");
const { insertLog } = require("../controllers/systemLogController");
const globaleCurrencyCodes = require("../models/globaleCurrencyCodeModel");
const currencyManagers = require("../models/currencyModel");
const { Op } = require("sequelize");
const fs = require("fs");
const { generateExcelData } = require("../utiles/commonFunction");

const createCurrency = async (req, res) => {
    try {
        const {
            country,
            currencyCode,
            currencyName,
            exchangeRateToUsd,
            isActive,
        } = req.body;
        const result = await sequelize.query(
            "EXEC insertCurrencyManagerData @countryId = :countryId, @currencyCode = :currencyCode, @currencyName = :currencyName, @exchangeRateToUsd = :exchangeRateToUsd, @isActive = :isActive",
            {
                replacements: {
                    countryId: country,
                    currencyCode: currencyCode,
                    currencyName: currencyName,
                    exchangeRateToUsd: exchangeRateToUsd,
                    isActive: isActive,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        insertLog(
            `${result[0][0].currencyId}`,
            "Insert",
            "Currency",
            req.user.id,
            currencyCode
        );
        return res.status(200).json({
            status: 200,
            message: "Currency has been created successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Insert",
            "Currency",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const updateCurrency = async (req, res) => {
    try {
        const id = req.params.id;
        const getCurrency = await currencyManagers.findByPk(id);
        const {
            country,
            currencyCode,
            currencyName,
            exchangeRateToUsd,
            isActive,
        } = req.body;
        await sequelize.query(
            "EXEC updateCurrencyManagerData @id = :id, @countryId = :countryId, @currencyCode = :currencyCode, @currencyName = :currencyName, @exchangeRateToUsd = :exchangeRateToUsd, @isActive = :isActive",
            {
                replacements: {
                    id: id,
                    countryId: country,
                    currencyCode: currencyCode,
                    currencyName: currencyName,
                    exchangeRateToUsd: exchangeRateToUsd,
                    isActive: isActive,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        insertLog(
            `${id}`,
            "Update",
            "Currency",
            req.user.id,
            getCurrency.currencyCode
        );
        return res.status(200).json({
            status: 200,
            message: "Currency has been updated successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Update",
            "Currency",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const listCurrency = async (req, res) => {
    try {
        let { status, page, pageSize, searchValue } = req.query;
        if (status === undefined) {
            status = null;
        }
        const offset = page && pageSize ? (page - 1) * pageSize : 0;
        const result = await sequelize.query(
            "EXEC listOfCurrencyManagerData @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @status = :status",
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
        return res.status(200).json({
            status: 200,
            message: searchValue
                ? "Currency results retrieved successfully."
                : "Currency retrieved successfully.",
            data: result,
            totalRecords: result[0][0]?.totalRecords
                ? result[0][0]?.totalRecords
                : 0,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "List",
            "Currency",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const listGlobalCurrencyCode = async (req, res) => {
    try {
        const result = await globaleCurrencyCodes.findAll({});
        return res.status(200).json({
            status: 200,
            message: "Currency retrieved successfully.",
            data: result,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "List",
            "Currency",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const deleteCurrency = async (req, res) => {
    try {
        const id = req.params.id;
        const getCurrency = await currencyManagers.findByPk(id);
        await sequelize.query("EXEC deleteCurrencyManagerData @id = :id", {
            replacements: {
                id: id,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        insertLog(
            `${id}`,
            "Delete",
            "Currency",
            req.user.id,
            getCurrency.currencyCode
        );
        return res.status(200).json({
            status: 200,
            message: "Currency has been deleted successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Delete",
            "Currency",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const getCurrencyById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await sequelize.query("EXEC getCurrencyById @id = :id", {
            replacements: {
                id: id,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        return res.status(200).json({
            status: 200,
            message: "Currency retrieved successfully.",
            data: result,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "getById",
            "Currency",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const deleteMultipleCurrency = async (req, res) => {
    try {
        let data = req.body.id;
        const getCurrency = await currencyManagers.findAll({
            where: {
                id: {
                    [Op.in]: data,
                },
            },
        });
        if (Array.isArray(data)) {
            data = data.join(",");
        }
        await sequelize.query("EXEC deleteCurrencyManagerData @id = :id", {
            replacements: {
                id: data,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        insertLog(
            `${data}`,
            "Multiple Delete",
            "Currency",
            req.user.id,
            getCurrency.map((item) => item.currencyCode)
        );
        return res.status(200).json({
            status: 200,
            message: "Currency has been deleted successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Multiple Delete",
            "Currency",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const updateCurrencyStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const currency = await currencyManagers.findByPk(id);
        const isActive = !req.body.isActive;
        console.log("isActiveisActive", isActive);
        if (currency) {
            await sequelize.query(
                "UPDATE currency SET isActive = :isActive WHERE id = :id",
                {
                    replacements: { isActive, id },
                    type: sequelize.QueryTypes.UPDATE,
                }
            );
            insertLog(
                `${id}`,
                "Update Status",
                "Currency",
                req.user.id,
                currency.isActive
            );
            return res.status(200).json({
                status: 200,
                message: "Currency status updated successfully",
            });
        } else {
            return res.status(200).json({
                status: 200,
                message: "Currency is not exists",
            });
        }
    } catch (error) {
        createErrorLog(
            error.message,
            "Update Status",
            "Currency",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try again later" });
    }
};

const exportCurrencyData = async (req, res) => {
    try {
        const { ids } = req.body;
        let getCurrency;
        if (ids === "all") {
            getCurrency = await sequelize.query(
                "EXEC listOfCurrencyManagerData @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @status = :status",
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
            getCurrency = await sequelize.query(
                "EXEC getCurrencyById @id = :id",
                {
                    replacements: {
                        id: ids.join(),
                    },
                    type: Sequelize.QueryTypes.RAW,
                }
            );
        }

        const data = getCurrency[0].map((currency) => {
            return {
                id: { label: "ID", value: currency.id },
                countryName: {
                    label: "Country Name",
                    value: currency.countryName,
                },
                currencyCode: {
                    label: "Currency Code",
                    value: currency.currencyCode,
                },
                currencyName: {
                    label: "Currency Name",
                    value: currency.currencyName,
                },
                exchangeRateToUsd: {
                    label: "Exchange Rate To Usd",
                    value: currency.exchangeRateToUsd,
                },
                isActive: { label: "Is Active", value: currency.isActive },
            };
        });

        const title = "Currency Data";
        const fileName = "currency.xlsx";
        const filePath = await generateExcelData(data, title, fileName);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=currency.xlsx`
        );

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        // Delete the temporary file after streaming
        fileStream.on("end", () => {
            fs.unlinkSync(filePath);
        });
        insertLog("-", "Export", "Currency", req.user.id, "-");
    } catch (error) {
        createErrorLog(
            error.message,
            "Export",
            "Currency",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

module.exports = {
    createCurrency,
    updateCurrency,
    listCurrency,
    deleteCurrency,
    getCurrencyById,
    deleteMultipleCurrency,
    updateCurrencyStatus,
    listGlobalCurrencyCode,
    exportCurrencyData,
};
