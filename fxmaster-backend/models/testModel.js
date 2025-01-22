const { Sequelize } = require("sequelize");

module.exports = (sequelize) => {
    const Table1 = sequelize.define(
        "aircraft_manager",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            aircraftType: {
                type: Sequelize.STRING,
            },
            aircraftModel: {
                type: Sequelize.STRING,
            },
            serialNumber: {
                type: Sequelize.STRING,
            },
            registration: {
                type: Sequelize.STRING,
            },
            maxTowTonnes: {
                type: Sequelize.STRING,
            },
            tailNumber: {
                type: Sequelize.STRING,
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            isDelete: {
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

    return Table1;
};
