const { Sequelize, sequelize } = require("../config/connection");

const airlineManagers = sequelize.define(
    "airline",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        callSign: {
            type: Sequelize.STRING,
        },
        countryId: {
            type: Sequelize.INTEGER,
        },
        iata: {
            type: Sequelize.STRING,
        },
        airlineName: {
            type: Sequelize.STRING,
        },
        airlineLogo: {
            type: Sequelize.STRING,
        },
        personDetail: {
            type: Sequelize.TEXT,
        },
        address: {
            type: Sequelize.STRING,
        },
        bankAccount: {
            type: Sequelize.TEXT,
        },
        bankName: {
            type: Sequelize.TEXT,
        },
        swiftCode: {
            type: Sequelize.TEXT,
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

module.exports = airlineManagers;
