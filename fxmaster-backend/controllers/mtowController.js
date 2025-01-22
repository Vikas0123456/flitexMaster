const { Sequelize, sequelize } = require("../config/connection");
const { createErrorLog } = require("../utiles/logmanager/logger");
const { insertLog } = require("../controllers/systemLogController");
const mtows = require("../models/mtowModel");
const { Op } = require("sequelize");
const settings = require("../settings");
const path = require("path");
const fs = require("fs");
const { generateExcelData } = require("../utiles/commonFunction");
const ExcelJS = require("exceljs");
const XLSX = require("xlsx");

const createMtow = async (req, res) => {
    try {
        const { aircraftType, mtow, isActive } = req.body;
        const result = await sequelize.query(
            "EXEC insertMtowData @aircraftId = :aircraftId, @mtow = :mtow, @isActive = :isActive",
            {
                replacements: {
                    aircraftId: aircraftType,
                    mtow: mtow,
                    isActive: isActive,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        insertLog(
            `${result[0][0].mtowId}`,
            "Insert",
            "MTOW",
            req.user.id,
            result[0][0].aircraftType
        );
        return res.status(200).json({
            status: 200,
            message: "Mtow has been created successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Insert",
            "MTOW",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const updateMtow = async (req, res) => {
    try {
        const { aircraftType, mtow, isActive } = req.body;
        const id = req.params.id;
        const getMtow = await mtows.findByPk(id);
        await sequelize.query(
            "EXEC updateMtowData @id = :id, @aircraftId = :aircraftId, @mtow = :mtow, @isActive = :isActive",
            {
                replacements: {
                    id: id,
                    aircraftId: aircraftType,
                    mtow: mtow,
                    isActive: isActive,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        insertLog(`${id}`, "Update", "MTOW", req.user.id, getMtow.mtow);
        return res.status(200).json({
            status: 200,
            message: "Mtow has been updated successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Update",
            "MTOW",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const listMtow = async (req, res) => {
    try {
        const status = req.query.status;
        const page = parseInt(req.query.page);
        const pageSize = parseInt(req.query.pageSize);
        const offset = (page - 1) * pageSize;
        const searchValue = req.query.searchValue;
        const result = await sequelize.query(
            "EXEC listOfMtowData @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @status = :status",
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
                ? "Mtow results retrieved successfully."
                : "Mtow retrieved successfully.",
            data: result,
            totalRecords: result[0][0]?.totalRecords
                ? result[0][0]?.totalRecords
                : 0,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "List",
            "MTOW",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const deletedMtow = async (req, res) => {
    try {
        const id = req.params.id;
        const getMtow = await mtows.findByPk(id);
        await sequelize.query("EXEC deleteMtowData @id = :id", {
            replacements: {
                id: id,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        insertLog(`${id}`, "Delete", "MTOW", req.user.id, getMtow.mtow);
        return res.status(200).json({
            status: 200,
            message: "Mtow has been deleted successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Delete",
            "MTOW",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const getMtowById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await sequelize.query("EXEC getMtowById @id = :id", {
            replacements: {
                id: id,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        return res.status(200).json({
            status: 200,
            message: "Mtow retrieved successfully.",
            data: result,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "getById",
            "MTOW",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const deleteMultipleMtow = async (req, res) => {
    try {
        let data = req.body.id;
        const getMtow = await mtows.findAll({
            where: {
                id: {
                    [Op.in]: data,
                },
            },
        });
        if (Array.isArray(data)) {
            data = data.join(",");
        }
        await sequelize.query("EXEC deleteMtowData @id = :id", {
            replacements: {
                id: data,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        insertLog(
            `${data}`,
            "Multiple Delete",
            "MTOW",
            req.user.id,
            getMtow.map((item) => item.mtow)
        );
        return res.status(200).json({
            status: 200,
            message: "Mtow has been deleted successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Multiple Delete",
            "MTOW",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const updateMtowStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const getMtow = await mtows.findByPk(id);
        const isActive = !req.body.isActive;
        if (getMtow) {
            await sequelize.query(
                "UPDATE mtow SET isActive = :isActive WHERE id = :id",
                {
                    replacements: { isActive, id },
                    type: sequelize.QueryTypes.UPDATE,
                }
            );
            insertLog(
                `${id}`,
                "Update Status",
                "MTOW",
                req.user.id,
                getMtow.isActive
            );
            return res.status(200).json({
                status: 200,
                message: "Mtow status has been updated successfully.",
            });
        } else {
            return res.status(200).json({
                status: 200,
                message: "Mtow is not exists",
            });
        }
    } catch (error) {
        createErrorLog(
            error.message,
            "Update Status",
            "MTOW",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const exportMtowData = async (req, res) => {
    try {
        const { ids } = req.body;
        let getMtow;
        if (ids === "all") {
            getMtow = await sequelize.query(
                "EXEC listOfMtowData @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @status = :status",
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
            getMtow = await sequelize.query("EXEC getMtowById @id = :id", {
                replacements: {
                    id: ids.join(),
                },
                type: Sequelize.QueryTypes.RAW,
            });
        }

        const data = getMtow[0].map((mtow) => {
            return {
                id: { label: "ID", value: mtow.id },
                mtow: { label: "Mtow", value: mtow.mtow },
                aircraftType: {
                    label: "Aircraft Type",
                    value: mtow.aircraftType,
                },
                aircraftModel: {
                    label: "Aircraft Model",
                    value: mtow.aircraftModel,
                },
                tailNumber: { label: "Tail Number", value: mtow.tailNumber },
                isActive: { label: "Is Active", value: mtow.isActive },
            };
        });
        const title = "Mtow Data";
        const fileName = "mtow.xlsx";

        const filePath = await generateExcelData(data, title, fileName);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", `attachment; filename=mtow.xlsx`);

        // Stream the file to the response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        // Delete the temporary file after streaming
        fileStream.on("end", () => {
            fs.unlinkSync(filePath);
        });
        insertLog("-", "Export", "MTOW", req.user.id, "-");
    } catch (error) {
        createErrorLog(
            error.message,
            "Export",
            "MTOW",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

module.exports = {
    createMtow,
    updateMtow,
    listMtow,
    deletedMtow,
    getMtowById,
    deleteMultipleMtow,
    updateMtowStatus,
    exportMtowData,
};
