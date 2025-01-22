const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    // "flitex_master",
    "harsh_fliterev_1706611736099",
    "fxMaster",
    "FCLtU=o6*TWC@uR",
    {
        host: "103.254.35.220",
        dialect: "mssql",
        define: {
            timestamps: true,
            freezeTableName: true,
        },
    }
);

sequelize
    .authenticate() // authenticate
    .then(() => {
        console.log("Connection has been established successfully...");
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });

module.exports = {
    Sequelize,
    sequelize,
};
