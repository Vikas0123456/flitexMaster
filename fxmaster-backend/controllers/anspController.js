const {
    encryptData,
    decryptData,
    imageRemove,
    generateExcelData,
} = require("../utiles/commonFunction");
const { Sequelize, sequelize } = require("../config/connection");
const { createErrorLog } = require("../utiles/logmanager/logger");
const { insertLog } = require("../controllers/systemLogController");
const ansps = require("../models/anspModel");
const fs = require("fs");

const createAnsp = async (req, res) => {
    try {
        const {
            name,
            email,
            phoneNumber,
            faxNumber,
            address,
            website,
            bankName,
            bankAccountNumber,
            swiftcode,
            isActive,
        } = req.body;
        const encryptedBankName = await encryptData(bankName);
        const encryptedAccountNumber = await encryptData(bankAccountNumber);
        const encryptSwiftCode = await encryptData(swiftcode);
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
            "EXEC insertAnspData @name = :name, @email = :email, @phoneNumber = :phoneNumber, @faxNumber = :faxNumber, @address = :address, @website = :website, @bankName = :bankName, @bankAccountNumber = :bankAccountNumber, @swiftcode = :swiftcode, @logo = :logo, @isActive = :isActive",
            {
                replacements: {
                    name: name,
                    email: email,
                    phoneNumber: phoneNumber,
                    faxNumber: faxNumber,
                    address: address,
                    website: website,
                    bankName: encryptedBankName,
                    bankAccountNumber: encryptedAccountNumber,
                    swiftcode: encryptSwiftCode,
                    logo: req.file.filename,
                    isActive: isActive,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        insertLog(
            `${result[0][0].anspId}`,
            "Insert",
            "ANSP",
            req.user.id,
            name
        );
        return res.status(200).json({
            status: 200,
            message: "Ansp has been created successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Insert",
            "ANSP",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const updateAnsp = async (req, res) => {
    try {
        const id = req.params.id;
        const getAnsp = await ansps.findByPk(id);
        const {
            isImageEdited,
            name,
            email,
            phoneNumber,
            faxNumber,
            address,
            website,
            bankName,
            bankAccountNumber,
            swiftcode,
            isActive,
        } = req.body;
        const isEdit = isImageEdited == "true" ? true : false;
        const encryptedBankName = await encryptData(bankName);
        const encryptedAccountNumber = await encryptData(bankAccountNumber);
        const encryptSwiftCode = await encryptData(swiftcode);
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
            "EXEC updateAnspData @id = :id, @name = :name, @email = :email, @phoneNumber = :phoneNumber, @faxNumber = :faxNumber, @address = :address, @website = :website, @bankName = :bankName, @bankAccountNumber = :bankAccountNumber, @swiftcode = :swiftcode, @logo = :logo, @isActive = :isActive",
            {
                replacements: {
                    id: id,
                    name: name,
                    email: email,
                    phoneNumber: phoneNumber,
                    faxNumber: faxNumber,
                    address: address,
                    website: website,
                    bankName: encryptedBankName,
                    bankAccountNumber: encryptedAccountNumber,
                    swiftcode: encryptSwiftCode,
                    logo: isEdit ? req.file.filename : req.body.filename,
                    isActive: isActive,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );
        if (isEdit) {
            await imageRemove(getAnsp.logo);
        }
        insertLog(`${id}`, "Update", "ANSP", req.user.id, getAnsp.name);
        return res.status(200).json({
            status: 200,
            message: "Ansp has been updated successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Update",
            "ANSP",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const listAnsp = async (req, res) => {
    try {
        const status = req.query.status;
        const page = parseInt(req.query.page);
        const pageSize = parseInt(req.query.pageSize);
        const offset = (page - 1) * pageSize;
        const searchValue = req.query.searchValue;
        const result = await sequelize.query(
            "EXEC listOfAnspData @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @status = :status",
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
        const decryptedData = result[0].map((item) => {
            return {
                ...item,
                swiftcode: decryptData(item.swiftcode),
                bankName: decryptData(item.bankName),
                bankAccountNumber: decryptData(item.bankAccountNumber),
            };
        });
        return res.status(200).json({
            status: 200,
            message: searchValue
                ? "Ansp results retrieved successfully."
                : "Ansp retrieved successfully.",
            data: decryptedData,
            totalRecords: result[0][0]?.totalRecords
                ? result[0][0]?.totalRecords
                : 0,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "List",
            "ANSP",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const getAnspById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await sequelize.query("EXEC getAnspDataById @id = :id", {
            replacements: {
                id: id,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        const decryptedData = result[0].map((item) => {
            return {
                ...item,
                swiftcode: decryptData(item.swiftcode),
                bankName: decryptData(item.bankName),
                bankAccountNumber: decryptData(item.bankAccountNumber),
            };
        });
        return res.status(200).json({
            status: 200,
            message: "Aircraft retrieved successfully.",
            data: decryptedData,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "getById",
            "ANSP",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const deleteAnsp = async (req, res) => {
    try {
        const id = req.params.id;
        const getAnsp = await ansps.findByPk(id);
        await sequelize.query("EXEC deleteAnspData @id = :id", {
            replacements: {
                id: id,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        await imageRemove(getAnsp.logo);
        insertLog(`${id}`, "Delete", "ANSP", req.user.id, getAnsp.name);
        return res.status(200).json({
            status: 200,
            message: "Ansp has been deleted successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Delete",
            "ANSP",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const deleteMultipleAnsp = async (req, res) => {
    try {
        let data = req.body.id;
        const getAnsp = await ansps.findAll({
            where: {
                id: data,
            },
        });
        data = data.join(",");
        await sequelize.query("EXEC deleteAnspData @id = :id", {
            replacements: {
                id: data,
            },
            type: Sequelize.QueryTypes.RAW,
        });
        getAnsp.forEach(async (entity) => await imageRemove(entity.logo));
        insertLog(
            `${data}`,
            "Multiple Delete",
            "ANSP",
            req.user.id,
            getAnsp.map((item) => item.name)
        );
        return res.status(200).json({
            status: 200,
            message: "Ansp has been deleted successfully.",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Multiple Delete",
            "ANSP",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const updateAnspStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const getAnsp = await ansps.findByPk(id);
        const isActive = !req.body.isActive;
        if (getAnsp) {
            await sequelize.query(
                "UPDATE ansp SET isActive = :isActive WHERE id = :id",
                {
                    replacements: { isActive, id },
                    type: sequelize.QueryTypes.UPDATE,
                }
            );
            insertLog(
                `${id}`,
                "Update Status",
                "ANSP",
                req.user.id,
                getAnsp.isActive
            );
            return res.status(200).json({
                status: 200,
                message: "Ansp status has been updated successfully.",
            });
        } else {
            return res.status(200).json({
                status: 200,
                message: "Ansp is not exists",
            });
        }
    } catch (error) {
        createErrorLog(
            error.message,
            "Update Status",
            "ANSP",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const exportAnspData = async (req, res) => {
    try {
        const { ids } = req.body;
        let getAnsp;
        if (ids === "all") {
            getAnsp = await sequelize.query(
                "EXEC listOfAnspData @offset = :offset, @pageSize = :pageSize, @searchValue = :searchValue, @status = :status",
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
            getAnsp = await sequelize.query("EXEC getAnspDataById @id = :id", {
                replacements: {
                    id: ids.join(),
                },
                type: Sequelize.QueryTypes.RAW,
            });
        }
        const data = getAnsp[0].map((ansp) => {
            return {
                id: { label: "ID", value: ansp.id },
                name: { label: "Name", value: ansp.name },
                email: { label: "Email", value: ansp.email },
                phoneNumber: { label: "Phone Number", value: ansp.phoneNumber },
                faxNumber: { label: "Fax Number", value: ansp.faxNumber },
                address: { label: "Address", value: ansp.address },
                website: { label: "Website", value: ansp.website },
                isActive: { label: "Is Active", value: ansp.isActive },
            };
        });

        const title = "Ansp Data";
        const fileName = "ansp.xlsx";
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
        insertLog("-", "Export", "Ansp", req.user.id, "-");
    } catch (error) {
        createErrorLog(
            error.message,
            "Export",
            "Ansp",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

module.exports = {
    createAnsp,
    updateAnsp,
    listAnsp,
    getAnspById,
    deleteAnsp,
    deleteMultipleAnsp,
    updateAnspStatus,
    exportAnspData,
};
