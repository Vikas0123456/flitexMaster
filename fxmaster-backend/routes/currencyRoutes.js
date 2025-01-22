const express = require("express");
const { schemaValidation } = require("../middleware/validation");
const {
    insertCurrencySchema,
    updateCurrencySchema,
} = require("../schemas/currencySchema");
const {
    createCurrency,
    deleteCurrency,
    listCurrency,
    updateCurrency,
    getCurrencyById,
    deleteMultipleCurrency,
    updateCurrencyStatus,
    listGlobalCurrencyCode,
    exportCurrencyData,
} = require("../controllers/currencyController");
const route = express.Router();
const tokenAuthentication =
    require("../middleware/authentication").authenticateToken;

route.post(
    "/",
    schemaValidation(insertCurrencySchema),
    tokenAuthentication,
    createCurrency
);
route.put(
    "/:id",
    schemaValidation(updateCurrencySchema),
    tokenAuthentication,
    updateCurrency
);
route.get("/", tokenAuthentication, listCurrency);
route.delete("/:id", tokenAuthentication, deleteCurrency);
route.get("/global-currency-code", tokenAuthentication, listGlobalCurrencyCode);
route.get("/:id", tokenAuthentication, getCurrencyById);
route.post("/multiple-delete", tokenAuthentication, deleteMultipleCurrency);
route.put(
    "/update-currency-status/:id",
    tokenAuthentication,
    updateCurrencyStatus
);
route.post("/export-currency", tokenAuthentication, exportCurrencyData);

module.exports = route;
