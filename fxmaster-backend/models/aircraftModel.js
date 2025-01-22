const { Sequelize, sequelize } = require("../config/connection");

const aircrafts = sequelize.define(
    "aircraft",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        aircraftType: {
            type: Sequelize.STRING,
        },
        aircraftModel: {
            type: Sequelize.STRING,
        },
        serialNumber: {
            type: Sequelize.STRING,
        },
        registrationYear: {
            type: Sequelize.STRING,
        },
        mtow: {
            type: Sequelize.STRING,
        },
        tailNumber: {
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
    }
);

module.exports = aircrafts;
