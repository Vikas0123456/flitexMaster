const express = require("express");
const {
    deleteLog,
    deleteMultipleLogs,
    filterSystemLog,
    getDashboardData,
    getAllUsers,
    exportSystemLogData,
} = require("../controllers/systemLogController");
const route = express();
const tokenAuthentication =
    require("../middleware/authentication").authenticateToken;

route.delete("/:id", tokenAuthentication, deleteLog);
route.post("/multiple-delete", tokenAuthentication, deleteMultipleLogs);
route.get("/filter-data", tokenAuthentication, filterSystemLog);
route.get("/dashboard-data", tokenAuthentication, getDashboardData);
route.get("/get-all-users", tokenAuthentication, getAllUsers);
route.post("/export-system-log", tokenAuthentication, exportSystemLogData);

module.exports = route;
