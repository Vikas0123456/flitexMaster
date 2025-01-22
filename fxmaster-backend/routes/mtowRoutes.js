const express = require("express");
const route = express.Router();
const { schemaValidation } = require("../middleware/validation");
const { insertMtowSchema, updateMtowSchema } = require("../schemas/mtowSchema");
const {
    createMtow,
    updateMtow,
    listMtow,
    updateMtowStatus,
    deletedMtow,
    getMtowById,
    deleteMultipleMtow,
    exportMtowData,
} = require("../controllers/mtowController");
const tokenAuthentication =
    require("../middleware/authentication").authenticateToken;

route.post(
    "/",
    schemaValidation(insertMtowSchema),
    tokenAuthentication,
    createMtow
);
route.put(
    "/:id",
    schemaValidation(updateMtowSchema),
    tokenAuthentication,
    updateMtow
);
route.get("/", tokenAuthentication, listMtow);
route.post("/multiple-delete", tokenAuthentication, deleteMultipleMtow);
route.delete("/:id", tokenAuthentication, deletedMtow);
route.get("/:id", tokenAuthentication, getMtowById);
route.put("/update-mtow-status/:id", tokenAuthentication, updateMtowStatus);
route.post("/export-mtow", tokenAuthentication, exportMtowData);

module.exports = route;
