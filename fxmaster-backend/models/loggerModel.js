const { Sequelize, sequelize } = require("../config/connection");

const loggers = sequelize.define(
    "logger",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        message: {
            type: Sequelize.STRING,
        },
        dateAndTime: {
            type: Sequelize.DATE,
        },
        action: {
            type: Sequelize.STRING,
        },
        moduleName: {
            type: Sequelize.STRING,
        },
        userId: {
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

module.exports = loggers;
