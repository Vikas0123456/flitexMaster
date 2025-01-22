const { Sequelize, sequelize } = require("../config/connection");

const ansps = sequelize.define(
    "ansp",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        phoneNumber: {
            type: Sequelize.STRING,
        },
        faxNumber: {
            type: Sequelize.STRING,
        },
        logo: {
            type: Sequelize.STRING,
        },
        address: {
            type: Sequelize.STRING,
        },
        website: {
            type: Sequelize.STRING,
        },
        bankName: {
            type: Sequelize.TEXT,
        },
        swiftcode: {
            type: Sequelize.TEXT,
        },
        bankAccountNumber: {
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
        timestamps: true,
    }
);

module.exports = ansps;
