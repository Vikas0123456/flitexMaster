const CryptoJS = require("crypto-js");
const settings = require("../settings");
const path = require("path");
const fs = require("fs");
const ExcelJS = require("exceljs");

const encryptData = async (data) => {
    const secretKey = process.env.SECRECT_KEY;
    const cipherText = CryptoJS.AES.encrypt(data, secretKey).toString();
    return cipherText;
};

const decryptData = (data) => {
    const secretKey = process.env.SECRECT_KEY;
    const bytes = CryptoJS.AES.decrypt(data, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedText;
};

const formatedDateAndTime = (data) => {
    const dateObject = new Date(data);

    // Convert UTC to local time
    const localDateObject = new Date(
        dateObject.getTime() + dateObject.getTimezoneOffset() * 60000
    );

    // Format the output as needed
    const outputFormat = localDateObject.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return outputFormat;
};

const imageRemove = async (data) => {
    const oldImagePath = path.join(
        settings.PROJECT_DIR + `/public/assets/${data}`
    );
    if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
    }
};

const generateExcelData = async (data, title, fileName) => {
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet(title);

    worksheet.mergeCells("A1:H1"); // Merge cells for the title
    worksheet.getCell("A1").value = title; // Set the title
    worksheet.getCell("A1").alignment = { horizontal: "center" };
    worksheet.getCell("A1").font = { bold: true, size: 14 };

    let headers = [];
    if (data.length > 0) {
        headers = Object.keys(data[0]).map((key) => data[0][key].label);
    }
    worksheet.addRow(headers);

    data.forEach((values) => {
        const rowValues = [];
        Object.values(values).forEach((item) => {
            if (Array.isArray(item.value)) {
                const personalDetails = item.value
                    .map((detail) => {
                        const { name, email, contactNumber } = detail.value;
                        return `Name: ${name}, Email: ${email}, Contact Number: ${contactNumber}`;
                    })
                    .join("\n");
                rowValues.push(personalDetails);
            } else if (typeof item.value === "object") {
                rowValues.push(item.value);
            } else {
                rowValues.push(item.value); // Convert non-object values to string
            }
        });
        worksheet.addRow(rowValues);
    });

    const filePath = path.join(settings.PROJECT_DIR, "public", fileName);
    await workbook.xlsx.writeFile(filePath);

    return filePath;
};

module.exports = {
    encryptData,
    decryptData,
    formatedDateAndTime,
    imageRemove,
    generateExcelData,
};
