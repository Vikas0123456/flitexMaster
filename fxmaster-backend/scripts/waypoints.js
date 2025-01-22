const { Sequelize } = require("sequelize");
const FlightplanInfo = require("../models/flightplanInfoModel");
const FlightplanRouteData = require("../models/flightplanRoutedata");
const waypoint = require("../models/waypointModel");
const vor = require("../models/vorModel");
const ndb = require("../models/ndbModel");

const sequelize = new Sequelize(
    "flitex_master",
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

const pgAdmin = new Sequelize(
    "little_navmap_navigraph",
    "avnadmin",
    "ZJe4YMxX0ra813utPyRQ",
    {
        host: "postgresql-01834fb4-o16acbbf3.database.cloud.ovh.net",
        port: 20184,
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    }
);

// const today = new Date().toISOString().slice(0, -14);
const previousMonth = new Date();
const nextMonth = new Date();
previousMonth.setDate(previousMonth.getDate() - 4);
nextMonth.setMonth(nextMonth.getMonth());
const nextDay = new Date();
nextDay.setDate(nextDay.getDate() + 1);
const today = new Date(nextMonth).toISOString().slice(0, -14);
const tomorrow = new Date(previousMonth).toISOString().slice(0, -14);

// Define your task function
const getWaypoints = async () => {
    try {
        await pgAdmin.authenticate();
        const ndbData = await pgAdmin.query(`SELECT * FROM ndb_2307`);
        const vorData = await pgAdmin.query(`SELECT * FROM vor_2307`);
        const waypointsData = await pgAdmin.query(
            `SELECT * FROM waypoint_2307`
        );
        let ndbCount = 0;
        let vorCount = 0;
        let waypointCount = 0;
        for (let index = 0; index < ndbData[0].length; index++) {
            const element = ndbData[0][index];
            const object = {
                file_id: element.file_id || null,
                ident: element.ident || null,
                name: element.name || null,
                region: element.region || null,
                airport_ident: element.airport_ident || null,
                type: element.type || null,
                latitude: element.laty || null,
                longitude: element.lonx || null,
            };
            await ndb
                .create(object)
                .then((res) => {
                    ndbCount++;
                    console.log(
                        `${object.ident} has been created successfully`
                    );
                })
                .catch((err) => {
                    console.log(`${object.ident} has been failed to created`);
                    console.log(err);
                });
        }

        for (let index = 0; index < vorData[0].length; index++) {
            const element = vorData[0][index];
            const object = {
                file_id: element.file_id || null,
                ident: element.ident || null,
                name: element.name || null,
                region: element.region || null,
                airport_ident: element.airport_ident || null,
                type: element.type || null,
                latitude: element.laty || null,
                longitude: element.lonx || null,
            };
            await vor
                .create(object)
                .then((res) => {
                    vorCount++;
                    console.log(
                        `${object.ident} has been created successfully`
                    );
                })
                .catch((err) => {
                    console.log(`${object.ident} has been failed to created`);
                    console.log(err);
                });
        }

        for (let index = 0; index < waypointsData[0].length; index++) {
            const element = waypointsData[0][index];
            const object = {
                file_id: element.file_id || null,
                ident: element.ident || null,
                name: element.name || null,
                region: element.region || null,
                airport_ident: element.airport_ident || null,
                arinc_type: element.arinc_type || null,
                type: element.type || null,
                latitude: element.laty || null,
                longitude: element.lonx || null,
            };
            await waypoint
                .create(object)
                .then((res) => {
                    waypointCount++;
                    console.log(
                        `${object.ident} has been created successfully`
                    );
                })
                .catch((err) => {
                    console.log(`${object.ident} has been failed to created`);
                    console.log(err);
                });
        }

        console.log(`Total ${ndbCount} NDB records `);
        console.log(`Total ${vorCount} VOR records `);
        console.log(`Total ${waypointCount} WAYPOINT records `);
        process.exit();
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
    console.log("Cron job executed at:", new Date());
};

function formatDateToCustomString(date) {
    const formattedDate = date.toISOString().replace("T", " ").replace("Z", "");

    return formattedDate;
}

getWaypoints();
