const express = require("express");
const {
    createAirline,
    updateAirline,
    listAirline,
    deleteAirline,
    getAirlineById,
    deleteMultipleAirline,
    updateAirlineStatus,
    exportAirlineData,
} = require("../controllers/airlineController");
const route = express();
const { schemaValidation } = require("../middleware/validation");
const {
    createAirlineSchema,
    updateAirlineSchema,
} = require("../schemas/airlineSchema");
const tokenAuthentication =
    require("../middleware/authentication").authenticateToken;
const createUploadMiddleware = require("../middleware/fileUpload");
const uploadAirlineLogoMiddleware = createUploadMiddleware("airlineLogo");

route.post(
    "/",
    uploadAirlineLogoMiddleware,
    schemaValidation(createAirlineSchema),
    tokenAuthentication,
    createAirline
);
route.put(
    "/:id",
    uploadAirlineLogoMiddleware,
    schemaValidation(updateAirlineSchema),
    tokenAuthentication,
    updateAirline
);
route.get("/", tokenAuthentication, listAirline);
route.delete("/:id", tokenAuthentication, deleteAirline);
route.get("/:id", tokenAuthentication, getAirlineById);
route.post("/multiple-delete", tokenAuthentication, deleteMultipleAirline);
route.put(
    "/update-airline-status/:id",
    tokenAuthentication,
    updateAirlineStatus
);
route.post("/export-airline", tokenAuthentication, exportAirlineData);

module.exports = route;
