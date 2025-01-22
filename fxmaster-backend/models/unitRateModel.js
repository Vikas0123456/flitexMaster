const { Sequelize, sequelize } = require("../config/connection");

const unitRatesModel = sequelize.define(
    "unit_rate",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        countryCode: {
            type: Sequelize.STRING,
        },
        dateFrom: {
            type: Sequelize.DATE,
        },
        dateTo: {
            type: Sequelize.DATE,
        },
        unitRate: {
            type: Sequelize.FLOAT,
        },
        currency: {
            type: Sequelize.STRING,
        },
        countryId: {
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

module.exports = unitRatesModel;
