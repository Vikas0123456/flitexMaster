const { Sequelize, sequelize } = require("../config/connection");

const users = sequelize.define(
    "flitex_master_user",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: Sequelize.STRING,
        },
        lastName: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
        },
        isAdmin: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        profilePic: {
            type: Sequelize.STRING,
        },
        verificationCode: {
            type: Sequelize.STRING,
            defaultValue: "",
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

module.exports = users;
