const { Sequelize } = require("sequelize");
const FlightplanInfo = require("../models/flightplanInfoModel");
const FlightplanRouteData = require("../models/flightplanRoutedata");

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
    "ibmclouddb",
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
console.log("todaytodaytoday", today);
console.log("tomorrow", tomorrow);

// Define your task function
const getFlightInfoData = async () => {
    try {
        await pgAdmin.authenticate();
        const currentDbData = await FlightplanInfo.findAll({
            attributes: ["flight_ref"],
        });
        let data;
        if (currentDbData.length > 0) {
            let flight_ref = currentDbData.map((f) => f.flight_ref);
            data = await pgAdmin.query(
                `SELECT * FROM flightplan_info WHERE etd <= '${today}' AND etd >= '${tomorrow}' AND flight_ref NOT IN (${flight_ref}) LIMIT 10`
            );
        } else {
            data = await pgAdmin.query(
                `SELECT * FROM flightplan_info WHERE etd <= '${today}' AND etd >= '${tomorrow}' LIMIT 10`
            );
        }
        let flightRouteData;
        if (data[0].length > 0) {
            let flightRef = data[0].map((r) => r.flight_ref);
            flightRouteData = await pgAdmin.query(
                `SELECT * FROM flightplan_routedata WHERE flight_ref IN (${flightRef})`
            );
        }

        const flightPlanRouteData = flightRouteData[0].reduce((map, item) => {
            const flightRef = item.flight_ref;
            if (!map[flightRef]) {
                map[flightRef] = [];
            }
            map[flightRef].push(item);
            return map;
        }, {});
        const preparedObjectOfFlightPlanData = data[0].map((item) => {
            const flightRef = item.flight_ref;
            const routedata = flightPlanRouteData[flightRef];

            if (routedata) {
                return {
                    ...item,
                    routedata: routedata,
                };
            }

            return item;
        });

        for (
            let index = 0;
            index < preparedObjectOfFlightPlanData.length;
            index++
        ) {
            const element = preparedObjectOfFlightPlanData[index];
            let object = {
                flight_ref: element.flight_ref,
                gufi: element.gufi ? element.gufi : "",
                aircraft_id: element.aircraft_id,
                airline: element.airline,
                source_facility: element.source_facility,
                source_timestamp: formatDateToCustomString(
                    new Date(element.source_timestamp)
                ),
                igtd: formatDateToCustomString(new Date(element.igtd)),
                departure: element.departure,
                arrival: element.arrival,
                etd: element.etd,
                eta: element.eta,
                aircraft_specs_value: element.aircraft_specs_value,
                coordination_time: formatDateToCustomString(
                    new Date(element.coordination_time)
                ),
                legacy_format: element.legacy_format,
                route_opt: element.route_opt,
            };
            console.log(object);
            await sequelize
                .query(
                    `
                        INSERT INTO flightplan_info (
                            flight_ref, gufi, aircraft_id, airline, source_facility, source_timestamp,
                            igtd, departure, arrival, etd, eta, aircraft_space_value, coordination_time,
                            legacy_format, route_opt
                        )
                        VALUES (
                            :flight_ref, :gufi, :aircraft_id, :airline, :source_facility,
                            :source_timestamp, :igtd, :departure, :arrival, :etd, :eta,
                            :aircraft_specs_value, :coordination_time, :legacy_format, :route_opt
                        )
                    `,
                    {
                        replacements: {
                            flight_ref: element.flight_ref,
                            gufi: element.gufi ? element.gufi : "",
                            aircraft_id: element.aircraft_id,
                            airline: element.airline,
                            source_facility: element.source_facility,
                            source_timestamp: formatDateToCustomString(
                                new Date(element.source_timestamp)
                            ),
                            igtd: formatDateToCustomString(
                                new Date(element.igtd)
                            ),
                            departure: element.departure,
                            arrival: element.arrival,
                            etd: formatDateToCustomString(
                                new Date(element.etd)
                            ),
                            eta: formatDateToCustomString(
                                new Date(element.eta)
                            ),
                            aircraft_specs_value: element.aircraft_specs_value,
                            coordination_time: formatDateToCustomString(
                                new Date(element.coordination_time)
                            ),
                            legacy_format: element.legacy_format,
                            route_opt: element.route_opt,
                        },
                        type: sequelize.QueryTypes.INSERT,
                    }
                )
                .then(async (res) => {
                    for (let i = 0; i < element.routedata.length; i++) {
                        const routeData = element.routedata[i];
                        await sequelize.query(
                            `
                            INSERT INTO flightplan_routedata (
                                flight_ref, fix, seq_fix, latitude, longitude, seq_wpt,
                                sector, seq_sector, elapsed_time
                            )
                            VALUES (
                                :flight_ref, :fix, :seq_fix, :latitude, :longitude,
                                :seq_wpt, :sector, :seq_sector, :elapsed_time
                            )
                        `,
                            {
                                replacements: {
                                    flight_ref: routeData.flight_ref,
                                    fix: routeData.fix ? routeData.fix : "",
                                    seq_fix: routeData.seq_fix,
                                    latitude: routeData.latitude,
                                    longitude: routeData.longitude,
                                    seq_wpt: routeData.seq_wpt,
                                    sector: routeData.sector,
                                    seq_sector: routeData.seq_sector,
                                    elapsed_time: routeData.elapsed_time,
                                },
                                type: sequelize.QueryTypes.INSERT,
                            }
                        );
                    }
                });
            break;
        }
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
    console.log("Cron job executed at:", new Date());
};

function formatDateToCustomString(date) {
    const formattedDate = date.toISOString().replace("T", " ").replace("Z", "");

    return formattedDate;
}

module.exports = {
    getFlightInfoData,
};
