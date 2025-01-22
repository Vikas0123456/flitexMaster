const { Sequelize, sequelize } = require("../config/connection");

const globaleCurrencyCodes = sequelize.define(
    "global_currency_code",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        currencyCode: {
            type: Sequelize.STRING,
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

module.exports = globaleCurrencyCodes;
