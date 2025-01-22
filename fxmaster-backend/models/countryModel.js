const { Sequelize, sequelize } = require("../config/connection");

const countryManagers = sequelize.define(
    "country",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        countryCode: {
            type: Sequelize.STRING,
        },
        countryName: {
            type: Sequelize.STRING,
        },
        flag: {
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

module.exports = countryManagers;
