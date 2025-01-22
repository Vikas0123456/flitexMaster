const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const cron = require("node-cron");
const { getFlightInfoData } = require("./controllers/cronController");

app.use(cors());
app.use(express.json()); //application/json
app.use(express.urlencoded({ extended: true }));

// cron.schedule("* * * * *", getFlightInfoData);
// cron.schedule("0 */6 * * *", getFlightInfoData);

app.use("/api/public", express.static(path.join(__dirname, "public")));

app.use("/api", require("./routes/index"));

app.listen(port, (err, result) => {
    if (err) {
        console.log({ err: "error while connecting in server" });
    } else {
        console.log(`Connection established on 🏃 Port ${port}`);
    }
});
