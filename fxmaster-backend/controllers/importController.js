const fs = require("fs");
const settings = require("../settings");
const path = require("path");
const tests = require("../models/testDataModel");
const xlsx = require("xlsx");

const importFile = async (req, res) => {
    try {
        const filePath = path.join(settings.PROJECT_DIR, req.file.path);
        fs.readFile(filePath, "utf-8", async (err, content) => {
            if (err) {
                return res
                    .status(400)
                    .json({ status: 400, error: "Error reading the file" });
            }

            const chunkSize = 1000;
            let records = [];

            if (filePath.endsWith(".csv")) {
                const results = content.split("\n").map((line) => {
                    const data = line.split(",");
                    return { name: data[0], address: data[1] };
                });

                records = results;

                const totalRecords = records.length;
                let currentIndex = 0;

                while (currentIndex < totalRecords) {
                    const chunkRecords = records.slice(
                        currentIndex,
                        currentIndex + chunkSize
                    );
                    await tests.bulkCreate(chunkRecords);
                    currentIndex += chunkSize;
                }
                return res
                    .status(200)
                    .json({
                        status: 200,
                        message: "Data imported successfully",
                    });
            } else if (filePath.endsWith(".xlsx")) {
                const workbook = xlsx.read(content, { type: "buffer" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                records = xlsx.utils.sheet_to_json(sheet).map((row) => ({
                    name: row.name,
                    address: row.address,
                }));
                const totalRecords = records.length;
                let currentIndex = 0;

                while (currentIndex < totalRecords) {
                    const chunkRecords = records.slice(
                        currentIndex,
                        currentIndex + chunkSize
                    );
                    await tests.bulkCreate(chunkRecords);
                    currentIndex += chunkSize;
                }
                return res
                    .status(200)
                    .json({
                        status: 200,
                        message: "Data imported successfully",
                    });
            } else {
                return res
                    .status(400)
                    .json({ status: 400, message: "Unsupported file format" });
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
};
module.exports = {
    importFile,
};
