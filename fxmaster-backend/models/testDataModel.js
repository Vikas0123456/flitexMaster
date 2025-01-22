const { Sequelize, sequelize } = require("../config/connection");

const testDatas = sequelize.define(
    "test_data",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        address: {
            type: Sequelize.STRING,
        },
    },
    {
        timestamps: false,
    }
);

module.exports = testDatas;
