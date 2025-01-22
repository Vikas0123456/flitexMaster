const express = require("express");
const {
    updateGlobalSetting,
    listGlobalSettings,
} = require("../controllers/settingController");
const route = express.Router();
const tokenAuthentication =
    require("../middleware/authentication").authenticateToken;

route.put("/", tokenAuthentication, updateGlobalSetting);
route.get("/", tokenAuthentication, listGlobalSettings);

module.exports = route;
