const { Sequelize, sequelize } = require("../config/connection");

const worldFirs = sequelize.define(
    "world_firs",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        fir_name: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        icao: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        countryId: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        coordinates: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
    },
    {
        indexes: [
            {
                fields: ["id", "fir_name", "icao", "countryId"],
            },
        ],
        timestamps: false,
    }
);

module.exports = worldFirs;
