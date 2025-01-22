const { Sequelize, sequelize } = require("../config/connection");

const currecyManagers = sequelize.define(
    "currency",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        countryId: {
            type: Sequelize.INTEGER,
        },
        currencyCode: {
            type: Sequelize.STRING,
        },
        currencyName: {
            type: Sequelize.STRING,
        },
        exchangeRateToUsd: {
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

module.exports = currecyManagers;
