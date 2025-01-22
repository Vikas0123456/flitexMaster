const express = require("express");
const {
    createAircraft,
    updateAircraft,
    listAircraft,
    deleteAircraft,
    getAircraftById,
    deleteMultipleAircraft,
    updateAircraftStatus,
    exportAircraftData,
} = require("../controllers/aircraftController");
const route = express();
const { schemaValidation } = require("../middleware/validation");
const {
    createAircraftSchema,
    updateAircraftSchema,
} = require("../schemas/aircraftSchema");
const tokenAuthentication =
    require("../middleware/authentication").authenticateToken;

route.post(
    "/",
    schemaValidation(createAircraftSchema),
    tokenAuthentication,
    createAircraft
);
route.put(
    "/:id",
    schemaValidation(updateAircraftSchema),
    tokenAuthentication,
    updateAircraft
);
route.get("/", tokenAuthentication, listAircraft);
route.delete("/:id", tokenAuthentication, deleteAircraft);
route.get("/:id", tokenAuthentication, getAircraftById);
route.put(
    "/update-aircraft-status/:id",
    tokenAuthentication,
    updateAircraftStatus
);
route.put("/", tokenAuthentication, deleteMultipleAircraft);
route.post("/export-aircraft", tokenAuthentication, exportAircraftData);

module.exports = route;
