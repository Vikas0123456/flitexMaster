const { Sequelize, sequelize } = require("../config/connection");

const fliteRevUserModel = sequelize.define(
    "flite_rev_user",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userName: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        },
        databaseName: {
            type: Sequelize.STRING,
        },
        domain: {
            type: Sequelize.STRING,
        },
        profilePic: {
            type: Sequelize.STRING,
        },
        firstName: {
            type: Sequelize.STRING,
        },
        lastName: {
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

module.exports = fliteRevUserModel;
