const express = require("express");
const { schemaValidation } = require("../middleware/validation");
const {
    createCountry,
    deleteCountryById,
    listCountry,
    updateCountry,
    getCountryById,
    updateCountryStatus,
    deleteMultipleCountry,
    exportCountryData,
} = require("../controllers/countryController");
const {
    createCountrySchema,
    updateCountrySchema,
} = require("../schemas/countrySchema");
const route = express.Router();
const tokenAuthentication =
    require("../middleware/authentication").authenticateToken;
const createUploadMiddleware = require("../middleware/fileUpload");
const uploadFlagMiddleware = createUploadMiddleware("flag");

route.post(
    "/",
    uploadFlagMiddleware,
    schemaValidation(createCountrySchema),
    tokenAuthentication,
    createCountry
);
route.put(
    "/:id",
    uploadFlagMiddleware,
    schemaValidation(updateCountrySchema),
    tokenAuthentication,
    updateCountry
);
route.get("/", tokenAuthentication, listCountry);
route.delete("/:id", tokenAuthentication, deleteCountryById);
route.get("/:id", tokenAuthentication, getCountryById);
route.put(
    "/update-country-status/:id",
    tokenAuthentication,
    updateCountryStatus
);
route.put("/", tokenAuthentication, deleteMultipleCountry);
route.post("/export-country", tokenAuthentication, exportCountryData);

module.exports = route;
