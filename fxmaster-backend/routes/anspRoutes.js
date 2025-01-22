const express = require("express");
const route = express();

const { schemaValidation } = require("../middleware/validation");
const tokenAuthentication =
    require("../middleware/authentication").authenticateToken;
const { createAnspSchema, updateAnspSchema } = require("../schemas/anspSchema");
const {
    createAnsp,
    updateAnsp,
    deleteAnsp,
    getAnspById,
    listAnsp,
    deleteMultipleAnsp,
    updateAnspStatus,
    exportAnspData,
} = require("../controllers/anspController");
const createUploadMiddleware = require("../middleware/fileUpload");
const uploadFlagMiddleware = createUploadMiddleware("logo");

route.post(
    "/",
    uploadFlagMiddleware,
    schemaValidation(createAnspSchema),
    tokenAuthentication,
    createAnsp
);
route.put(
    "/:id",
    uploadFlagMiddleware,
    schemaValidation(updateAnspSchema),
    tokenAuthentication,
    updateAnsp
);
route.get("/", tokenAuthentication, listAnsp);
route.delete("/:id", tokenAuthentication, deleteAnsp);
route.get("/:id", tokenAuthentication, getAnspById);
route.put("/update-ansp-status/:id", tokenAuthentication, updateAnspStatus);
route.post("/multiple-delete", tokenAuthentication, deleteMultipleAnsp);
route.post("/export-ansp", tokenAuthentication, exportAnspData);

module.exports = route;
