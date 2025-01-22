const express = require("express");
const router = express();

router.use("/user", require("./authRoutes"));
router.use("/airline", require("./airlineRoutes"));
router.use("/aircraft", require("./aircraftRoutes"));
router.use("/mtow", require("./mtowRoutes"));
router.use("/unit-rates", require("./unitRatesRoute"));
router.use("/country", require("./countryRoutes"));
router.use("/currency", require("./currencyRoutes"));
router.use("/import", require("./importRoutes"));
router.use("/flite-rev-user", require("./fliteRevUserRoutes"));
router.use("/flitex-master-user", require("./flitexMasterUserRoutes"));
router.use("/ansp", require("./anspRoutes"));
router.use("/log", require("./systemLogRoutes"));
router.use("/setting", require("./settingRoutes"));
router.use("/workflow", require("./workflowRoutes"));

module.exports = router;
