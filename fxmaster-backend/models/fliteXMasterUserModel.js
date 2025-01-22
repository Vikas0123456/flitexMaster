const { Sequelize, sequelize } = require("../config/connection");

const flitexMasterUsersModel = sequelize.define(
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
            type: Sequelize.STRING,
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        profilePic: {
            type: Sequelize.STRING,
        },
        verificationCode: {
            type: Sequelize.STRING,
            defaultValue: null,
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
        timestamps: false,
    }
);

module.exports = flitexMasterUsersModel;
