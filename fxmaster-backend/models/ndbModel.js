const { Sequelize, sequelize } = require("../config/connection");

const ndb = sequelize.define(
    "ndb",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        file_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        ident: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        region: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        airport_ident: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        type: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        latitude: {
            type: Sequelize.REAL,
            allowNull: true,
        },
        longitude: {
            type: Sequelize.REAL,
            allowNull: true,
        },
    },
    {
        indexes: [
            {
                fields: ["id", "ident"],
            },
        ],
        timestamps: false,
    }
);

module.exports = ndb;
