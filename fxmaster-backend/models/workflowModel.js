const { Sequelize, sequelize } = require("../config/connection");

const workflowManagers = sequelize.define(
    "workflow",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        workflowName: {
            type: Sequelize.STRING,
        },
        roleId: {
            type: Sequelize.INTEGER,
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
        // createdAt: {
        //     type: Sequelize.DATETIME,
        // },
        // updatedAt: {
        //     type: Sequelize.DATETIME,
        // },
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

module.exports = workflowManagers;
