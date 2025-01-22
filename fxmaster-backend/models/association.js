const aircraftManager = require("../models/aircraftModel");
const matowManager = require("../models/mtowModel");
const countryManagers = require("../models/countryModel");
const currencyManagers = require("../models/currencyModel");
const airlineManagers = require("../models/airlineModel");
const loggers = require("../models/loggerModel");
const flitexMasterUser = require("../models/userModel");

aircraftManager.hasMany(matowManager, {
    foreignKey: {
        name: "aircraftId",
        sourceKey: "id",
    },
});
matowManager.belongsTo(aircraftManager, {
    foreignKey: "aircraftId",
    targetKey: "id",
});

airlineManagers.belongsTo(countryManagers, {
    foreignKey: "countryId",
    targetKey: "id",
});

loggers.belongsTo(flitexMasterUser, {
    foreignKey: "userId",
    targetKey: "id",
});

countryManagers.hasMany(currencyManagers, {
    foreignKey: {
        name: "countryId",
        sourceKey: "id",
    },
});
currencyManagers.belongsTo(countryManagers, {
    foreignKey: "countryId",
    targetKey: "id",
});
