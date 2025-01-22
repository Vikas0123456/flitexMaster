const { Sequelize, sequelize } = require("../config/connection");
const { createErrorLog } = require("../utiles/logmanager/logger");
const { insertLog } = require("../controllers/systemLogController");
const aircrafts = require("../models/aircraftModel");
const { Op } = require("sequelize");
const fs = require("fs");
const { generateExcelData } = require("../utiles/commonFunction");

const createAircraft = async (req, res) => {
    try {
        const {
            aircraftType,
            aircraftModel,
            serialNumber,
            registrationYear,
            mtow,
            tailNumber,
            isActive,
        } = req.body;
        const result = await sequelize.query(
            "EXEC insertAircraftData @aircraftType = :aircraftType, @aircraftModel = :aircraftModel, @serialNumber = :serialNumber, @registrationYear = :registrationYear, @mtow = :mtow, @tailNumber = :tailNumber, @isActive = :isActive",
            {
                replacements: {
                    aircraftType: aircraftType,
                    aircraftModel: aircraftModel,
                    serialNumber: serialNumber,
                    registrationYear: registrationYear,
                    mtow: mtow,
                    tailNumber: tailNumber,
                    isActive: isActive,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        insertLog(
            `${result[0][0].aircraftId}`,
            "Insert",
            "Aircraft",
            req.user.id,
            aircraftModel
        );
        return res.status(200).json({
            status: 200,
            message: "Aircraft has been created successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Insert",
            "Aircraft",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try again later" });
    }
};

const updateAircraft = async (req, res) => {
    try {
        const id = req.params.id;
        const getAircraft = await aircrafts.findByPk(id);
        const {
            aircraftType,
            aircraftModel,
            serialNumber,
            registrationYear,
            mtow,
            tailNumber,
            isActive,
        } = req.body;
        await sequelize.query(
            "EXEC updateAircraftData @id = :id, @aircraftType = :aircraftType, @aircraftModel = :aircraftModel, @serialNumber = :serialNumber, @registrationYear = :registrationYear, @mtow = :mtow, @tailNumber = :tailNumber, @isActive = :isActive",
            {
                replacements: {
                    id: id,
                    aircraftType: aircraftType,
                    aircraftModel: aircraftModel,
                    serialNumber: serialNumber,
                    registrationYear: registrationYear,
                    mtow: mtow,
                    tailNumber: tailNumber,
                    isActive: isActive,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        insertLog(
            `${id}`,
            "Update",
            "Aircraft",
            req.user.id,
            getAircraft.aircraftModel
        );
        return res.status(200).json({
            status: 200,
            message: "Aircraft has been updated successfully.",
        });
    } catch (error) {
        console.log(error);
        createErrorLog(
            error.message,
            "Update",
            "Aircraft",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try again later" });
    }
};

const listAircraft = async (req, res) => {
    try {
        let { status, page, pageSize, searchValue } = req.query;
        if (status === undefined) {
            status = null;
        }
        const offset = page && pageSize ? (page - 1) * pageSize : 0;
        const result = await sequelize.query(
            "EXEC listOfAircraftData @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @status = :status",
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
                    `SELECT TOP 1 * FROM mtow WHERE aircraftId = ${result[0][index].id} AND isActive = 1 AND isDeleted = 0`
                )
                .then((res) => {
                    if (res[0].length > 0) {
                        result[0][index].isUsedByReference = true;
                    } else {
                        result[0][index].isUsedByReference = false;
                    }
                });
        }
        return res.status(200).json({
            status: 200,
            message: searchValue
                ? "Aircraft results retrieved successfully."
                : "Aircraft retrieved successfully.",
            data: result,
            totalRecords: result[0][0]?.totalRecords
                ? result[0][0]?.totalRecords
                : 0,
        });
    } catch (error) {
        console.log(error);
        createErrorLog(
            error.message,
            "List",
            "Aircraft",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try again later" });
    }
};

const deleteAircraft = async (req, res) => {
    try {
        const id = req.params.id;
        const getAircraft = await aircrafts.findByPk(id);
        await sequelize.query("EXEC deleteAircraftData @id = :id", {
            replacements: {
                id: id,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        insertLog(
            `${id}`,
            "Delete",
            "Aircraft",
            req.user.id,
            getAircraft.aircraftType
        );
        return res.status(200).json({
            status: 200,
            message: "Aircraft has been deleted successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Delete",
            "Aircraft",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try again later" });
    }
};

const getAircraftById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await sequelize.query("EXEC getAircraftById @id = :id", {
            replacements: {
                id: id,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        return res.status(200).json({
            status: 200,
            message: "Aircraft retrieved successfully.",
            data: result,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "getById",
            "Aircraft",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try again later" });
    }
};

const deleteMultipleAircraft = async (req, res) => {
    try {
        let data = req.body.id;
        const getAircraft = await aircrafts.findAll({
            where: {
                id: {
                    [Op.in]: data,
                },
            },
        });
        if (Array.isArray(data)) {
            data = data.join(",");
        }
        await sequelize.query("EXEC deleteAircraftData @id = :id", {
            replacements: {
                id: data,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        insertLog(
            `${data} has been deleted successfully.`,
            "Multiple Delete",
            "Aircraft",
            req.user.id,
            getAircraft.map((item) => item.aircraftType)
        );
        return res.status(200).json({
            status: 200,
            message: "Aircrafts has been deleted successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Multiple Delete",
            "Aircraft",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try again later" });
    }
};

const updateAircraftStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const aircraft = await aircrafts.findByPk(id);
        const isActive = !req.body.isActive;
        if (aircraft) {
            await sequelize.query(
                "UPDATE aircraft SET isActive = :isActive WHERE id = :id",
                {
                    replacements: { isActive, id },
                    type: sequelize.QueryTypes.UPDATE,
                }
            );
            insertLog(
                `${id}`,
                "Update Status",
                "Aircraft",
                req.user.id,
                aircraft.isActive
            );
            return res.status(200).json({
                status: 200,
                message: "Aircraft status has been updated successfully",
            });
        } else {
            createErrorLog(
                error.message,
                "Update Status",
                "Aircraft",
                req.user.id,
                req.user.email
            );
            return res.status(200).json({
                status: 200,
                message: "Aircraft is not exists",
            });
        }
    } catch (error) {
        createErrorLog(
            error.message,
            "Update Status",
            "Aircraft",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong! Please try again later" });
    }
};

const exportAircraftData = async (req, res) => {
    try {
        const { ids } = req.body;
        let getAircraft;
        if (ids === "all") {
            getAircraft = await sequelize.query(
                "EXEC listOfAircraftData @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @status = :status",
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
            getAircraft = await sequelize.query(
                "EXEC getAircraftById @id = :id",
                {
                    replacements: {
                        id: ids.join(),
                    },
                    type: Sequelize.QueryTypes.RAW,
                }
            );
        }

        const data = getAircraft[0].map((aircraft) => {
            return {
                id: { label: "ID", value: aircraft.id },
                aircraftType: {
                    label: "Aircraft Type",
                    value: aircraft.aircraftType,
                },
                aircraftModel: {
                    label: "Aircraft Model",
                    value: aircraft.aircraftModel,
                },
                tailNumber: {
                    label: "Tail Number",
                    value: aircraft.tailNumber,
                },
                serialNumber: {
                    label: "Serial Number",
                    value: aircraft.serialNumber,
                },
                registrationYear: {
                    label: "Registration Year",
                    value: aircraft.registrationYear,
                },
                mtow: { label: "Mtow", value: aircraft.mtow },
                isActive: { label: "Is Active", value: aircraft.isActive },
            };
        });
        const title = "Aircraft Data";
        const fileName = "aircraft.xlsx";
        const filePath = await generateExcelData(data, title, fileName);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=aircraft.xlsx`
        );

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        // Delete the temporary file after streaming
        fileStream.on("end", () => {
            fs.unlinkSync(filePath);
        });
        insertLog("-", "Export", "Aircraft", req.user.id, "-");
    } catch (error) {
        createErrorLog(
            error.message,
            "Export",
            "Aircraft",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

module.exports = {
    createAircraft,
    updateAircraft,
    listAircraft,
    deleteAircraft,
    getAircraftById,
    updateAircraftStatus,
    deleteMultipleAircraft,
    exportAircraftData,
};
