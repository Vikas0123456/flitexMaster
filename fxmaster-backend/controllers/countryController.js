const { sequelize, Sequelize } = require("../config/connection");
const { createErrorLog } = require("../utiles/logmanager/logger");
const { insertLog } = require("../controllers/systemLogController");
const countrys = require("../models/countryModel");
const { imageRemove, generateExcelData } = require("../utiles/commonFunction");
const fs = require("fs");

const createCountry = async (req, res) => {
    try {
        const { countryCode, countryName, isActive } = req.body;
        const result = await sequelize.query(
            "EXEC insertCountryData @countryCode = :countryCode, @countryName = :countryName, @flag = :flag, @isActive = :isActive",
            {
                replacements: {
                    countryCode: countryCode,
                    countryName: countryName,
                    flag: req.file.filename,
                    isActive: isActive,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        insertLog(
            `${result[0][0].countryId}`,
            "Insert",
            "Country",
            req.user.id,
            countryName
        );
        return res.status(200).json({
            status: 200,
            message: "Country has been created successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Insert",
            "Country",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const updateCountry = async (req, res) => {
    try {
        const id = req.params.id;
        const getCountry = await countrys.findByPk(id);
        const { countryCode, countryName, isActive, isImageEdited } = req.body;
        const isEdit = isImageEdited == "true" ? true : false;
        await sequelize.query(
            "EXEC updateCountryData @id = :id, @countryCode = :countryCode, @countryName = :countryName, @flag = :flag, @isActive = :isActive",
            {
                replacements: {
                    id: id,
                    countryCode: countryCode,
                    countryName: countryName,
                    flag: isEdit ? req.file.filename : req.body.filename,
                    isActive: isActive,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        if (isEdit) {
            await imageRemove(getCountry.flag);
        }
        insertLog(
            `${id}`,
            "Update",
            "Country",
            req.user.id,
            getCountry.countryName
        );
        return res.status(200).json({
            status: 200,
            message: "Country has been updated successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Update",
            "Country",
            req.user.id,
            req.user.email
        );
        return res.status(500).json({
            message: "Something went wrong. Please try again later",
        });
    }
};

const listCountry = async (req, res) => {
    try {
        let { status, page, pageSize, searchValue } = req.query;
        // Check if status is undefined and set it to null
        if (status === undefined) {
            status = null;
        }
        const offset = page && pageSize ? (page - 1) * pageSize : 0;

        const result = await sequelize.query(
            "EXEC listOfCountryData @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @status = :status",
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
        for (let index = 0; index < result[0].length; index++) {
            await sequelize
                .query(
                    `SELECT TOP 1 * FROM currency WHERE countryId = ${result[0][index].id} AND isActive = 1 AND isDeleted = 0`
                )
                .then((res) => {
                    if (res[0].length > 0) {
                        result[0][index].isUsedByReference = true;
                        result[0][index].isUsedByCountry = true;
                    } else {
                        result[0][index].isUsedByReference = false;
                        result[0][index].isUsedByCountry = false;
                    }
                });
        }
        const filteredData = result[0].filter((ele) => !ele.isUsedByReference);
        if (filteredData.length > 0) {
            for (let index = 0; index < filteredData.length; index++) {
                await sequelize
                    .query(
                        `SELECT TOP 1 * FROM airline WHERE countryId = ${filteredData[index].id} AND isActive = 1 AND isDeleted = 0`
                    )
                    .then((res) => {
                        if (res[0].length > 0) {
                            filteredData[index].isUsedByReference = true;
                        }
                    });
            }
        }

        for (let index = 0; index < result[0].length; index++) {
            const element = result[0][index];
            const matchingObj = filteredData.find(
                (data) => data.id === element.id
            );
            if (matchingObj) {
                result[0][index].isUsedByReference =
                    matchingObj.isUsedByReference;
            }
        }

        return res.status(200).json({
            status: 200,
            message: searchValue
                ? "Country results retrieved successfully."
                : "Country retrieved successfully.",
            data: result,
            totalRecords: result[0][0]?.totalRecords
                ? result[0][0]?.totalRecords
                : 0,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "List",
            "Country",
            req.user.id,
            req.user.email
        );
        return res.status(500).json({
            message: "Something went wrong. Please try again later",
        });
    }
};

const deleteCountryById = async (req, res) => {
    try {
        const id = req.params.id;
        const getCountry = await countrys.findByPk(id);
        await sequelize.query("EXEC deleteCountryData @id = :id", {
            replacements: {
                id: id,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        await imageRemove(getCountry.flag);
        insertLog(
            `${id}`,
            "Delete",
            "Country",
            req.user.id,
            getCountry.countryName
        );
        return res.status(200).json({
            status: 200,
            message: "Country has been deleted successfully.",
        });
    } catch (error) {
        console.log("error", error);
        createErrorLog(
            error.message,
            "Delete",
            "Country",
            req.user.id,
            req.user.email
        );
        return res.status(500).json({
            message: "Something went wrong. Please try again later",
        });
    }
};

const getCountryById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await sequelize.query(
            "EXEC getCountryManagerById @id = :id",
            {
                replacements: {
                    id: id,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        return res.status(200).json({
            status: 200,
            message: "Country retrieved successfully.",
            data: result,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "getById",
            "Country",
            req.user.id,
            req.user.email
        );
        return res.status(500).json({
            message: "Something went wrong. Please try again later",
        });
    }
};

const deleteMultipleCountry = async (req, res) => {
    try {
        let data = req.body.id;
        if (!Array.isArray(data)) {
            data = [data];
        }
        const getCountry = await countrys.findAll({
            where: {
                id: data,
            },
        });
        data = data.join(",");
        await sequelize.query("EXEC deleteCountryData @id = :id", {
            replacements: {
                id: data,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        getCountry.forEach(async (entity) => await imageRemove(entity.flag));
        insertLog(
            `${data}`,
            "Multiple Delete",
            "Country",
            req.user.id,
            getCountry.map((item) => item.countryName)
        );
        return res.status(200).json({
            status: 200,
            message: "Country has been deleted successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Multiple Delete",
            "Country",
            req.user.id,
            req.user.email
        );
        return res.status(500).json({
            message: "Something went wrong. Please try again later",
        });
    }
};

const updateCountryStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const country = await countrys.findByPk(id);
        const isActive = !req.body.isActive;
        if (country) {
            await sequelize.query(
                "UPDATE country SET isActive = :isActive WHERE id = :id",
                {
                    replacements: { isActive, id },
                    type: sequelize.QueryTypes.UPDATE,
                }
            );
            insertLog(
                `${id}`,
                "Update Status",
                "Country",
                req.user.id,
                country.isActive
            );
            return res.status(200).json({
                status: 200,
                message: "Country status has been updated successfully.",
            });
        } else {
            return res.status(200).json({
                status: 200,
                message: "Country is not exists",
            });
        }
    } catch (error) {
        createErrorLog(
            error.message,
            "Update Status",
            "Country",
            req.user.id,
            req.user.email
        );
        return res.status(500).json({
            message: "Something went wrong. Please try again later",
        });
    }
};

const exportCountryData = async (req, res) => {
    try {
        const { ids } = req.body;
        let getCountry;
        if (ids === "all") {
            getCountry = await sequelize.query(
                "EXEC listOfCountryData @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @status = :status",
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
            getCountry = await sequelize.query(
                "EXEC getCountryManagerById @id = :id",
                {
                    replacements: {
                        id: ids.join(),
                    },
                    type: Sequelize.QueryTypes.RAW,
                }
            );
        }

        const data = getCountry[0].map((country) => {
            return {
                id: { label: "ID", value: country.id },
                countryCode: {
                    label: "Country Code",
                    value: country.countryCode,
                },
                countryName: {
                    label: "Country Name",
                    value: country.countryName,
                },
                isActive: { label: "Is Active", value: country.isActive },
            };
        });

        const title = "Country Data";
        const fileName = "country.xlsx";
        const filePath = await generateExcelData(data, title, fileName);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=country.xlsx`
        );

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        // Delete the temporary file after streaming
        fileStream.on("end", () => {
            fs.unlinkSync(filePath);
        });
        insertLog("-", "Export", "Country", req.user.id, "-");
    } catch (error) {
        createErrorLog(
            error.message,
            "Export",
            "Country",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

module.exports = {
    createCountry,
    updateCountry,
    listCountry,
    deleteCountryById,
    getCountryById,
    updateCountryStatus,
    deleteMultipleCountry,
    exportCountryData,
};
