const { Sequelize, sequelize } = require("../config/connection");
const FlightplanInfo = require("./flightplanInfo");

const FlightplanRouteData = sequelize.define(
    "flightplan_routedata",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        flight_ref: {
            type: Sequelize.BIGINT,
            allowNull: false,
            index: true,
        },
        fix: {
            type: Sequelize.STRING,
        },
        seq_fix: {
            type: Sequelize.INTEGER,
        },
        latitude: {
            type: Sequelize.REAL,
        },
        longitude: {
            type: Sequelize.REAL,
        },
        seq_wpt: {
            type: Sequelize.INTEGER,
        },
        sector: {
            type: Sequelize.STRING,
        },
        seq_sector: {
            type: Sequelize.INTEGER,
        },
        elapsed_time: {
            type: Sequelize.INTEGER,
        },
    },
    {
        indexes: [
            {
                unique: true,
                fields: ["id"],
            },
        ],
        timestamps: true,
    }
);

FlightplanRouteData.belongsTo(FlightplanInfo, {
    foreignKey: "flight_ref",
    targetKey: "flight_ref",
});

module.exports = FlightplanRouteData;
