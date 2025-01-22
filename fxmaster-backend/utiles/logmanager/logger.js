const fs = require("fs");
const settings = require("../../settings");
const path = require("path");
var os = require("os");

const createFolder = (data) => {
    if (!fs.existsSync(data)) {
        fs.mkdirSync(data, { recursive: true });
    }
};

const createErrorLog = (err, action, moduleName, userId, email) => {
    const folderPath = path.join(
        settings.PROJECT_DIR,
        "logs",
        `${email.split("@")[0]}_${userId}`
    );
    createFolder(folderPath);

    const filePath = path.join(folderPath, "error.json");

    let dataArray = [];

    if (fs.existsSync(filePath)) {
        const existingData = fs.readFileSync(filePath, "utf-8");
        dataArray = JSON.parse(existingData);
    } else {
        dataArray = [];
        fs.writeFileSync(filePath, "[]", "utf-8");
    }

    const now = new Date();
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
    };
    const nowDataAndTime = now.toLocaleDateString("en-US", options);
    const interfaces = os.networkInterfaces();
    let ipAddress = null;

    for (const k in interfaces) {
        for (const k2 in interfaces[k]) {
            const address = interfaces[k][k2];
            if (address.family === "IPv4" && !address.internal) {
                ipAddress = address.address;
                break;
            }
        }
        if (ipAddress) {
            break;
        }
    }
    const formattedMessage = {
        date: nowDataAndTime,
        message: err,
        action: action,
        moduleName: moduleName,
        ipAddress: ipAddress,
    };
    dataArray.push(formattedMessage);

    fs.writeFileSync(filePath, JSON.stringify(dataArray, null, 2) + "\n");
    return filePath;
};

module.exports = {
    createErrorLog,
};
