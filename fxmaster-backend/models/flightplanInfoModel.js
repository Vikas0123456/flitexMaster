const { Sequelize, sequelize } = require("../config/connection");

const FlightplanInfo = sequelize.define(
    "flightplan_info",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        flight_ref: {
            type: Sequelize.BIGINT,
            unique: true,
            allowNull: false,
            index: true,
        },
        gufi: {
            type: Sequelize.STRING,
            allowNull: true,
            index: true,
        },
        aircraft_id: {
            type: Sequelize.STRING,
        },
        airline: {
            type: Sequelize.STRING,
            index: true,
        },
        source_facility: {
            type: Sequelize.STRING,
        },
        source_timestamp: {
            type: Sequelize.DATE,
            index: true,
        },
        igtd: {
            type: Sequelize.DATE,
        },
        departure: {
            type: Sequelize.STRING,
        },
        arrival: {
            type: Sequelize.STRING,
        },
        etd: {
            type: Sequelize.DATE,
        },
        eta: {
            type: Sequelize.DATE,
        },
        aircraft_space_value: {
            type: Sequelize.STRING,
            index: true,
        },
        coordination_time: {
            type: Sequelize.DATE,
            index: true,
        },
        legacy_format: {
            type: Sequelize.STRING,
            index: true,
        },
        route_opt: {
            type: Sequelize.STRING,
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        indexes: [
            {
                unique: true,
                fields: ["id"],
            },
        ],
        timestamps: false,
    }
);

module.exports = FlightplanInfo;
