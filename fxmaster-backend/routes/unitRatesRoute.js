const express = require("express");
const route = express.Router();
const { schemaValidation } = require("../middleware/validation");
const {
    insertUnitRateSchema,
    updateUnitRateSchema,
} = require("../schemas/unitRatesSchema");
const {
    createUnitRates,
    deleteUnitRates,
    listUnitRates,
    updateUniteRates,
    getUnitRateById,
    deleteMultipleUnitRates,
    updateUnitRateStatus,
    exportUnitRateData,
} = require("../controllers/unitRateController");
const tokenAuthentication =
    require("../middleware/authentication").authenticateToken;

route.post(
    "/",
    schemaValidation(insertUnitRateSchema),
    tokenAuthentication,
    createUnitRates
);
route.put(
    "/:id",
    schemaValidation(updateUnitRateSchema),
    tokenAuthentication,
    updateUniteRates
);
route.get("/", tokenAuthentication, listUnitRates);
route.delete("/:id", tokenAuthentication, deleteUnitRates);
route.get("/:id", tokenAuthentication, getUnitRateById);
route.put(
    "/update-unit-rate-status/:id",
    tokenAuthentication,
    updateUnitRateStatus
);
route.put("/", tokenAuthentication, deleteMultipleUnitRates);
route.post("/export-unit-rates", tokenAuthentication, exportUnitRateData);

module.exports = route;
