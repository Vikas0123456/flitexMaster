const { Sequelize, sequelize } = require("../config/connection");

const mtows = sequelize.define(
    "mtow",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        aircraftId: {
            type: Sequelize.INTEGER,
        },
        mtow: {
            type: Sequelize.INTEGER,
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

module.exports = mtows;
