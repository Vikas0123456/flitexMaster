const express = require("express");
const { importFile } = require("../controllers/importController");
const createUploadMiddleware = require("../middleware/fileUpload");
const uploadFlagMiddleware = createUploadMiddleware("importData");

const route = express();

route.post("/", uploadFlagMiddleware, importFile);

module.exports = route;
