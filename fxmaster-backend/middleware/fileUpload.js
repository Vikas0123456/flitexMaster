const multer = require("multer");
const path = require("path");
const settings = require("../settings");
const fs = require("fs");

const createUploadMiddleware = (fieldName) => {
    // Define storage for multer
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // Specify the destination directory
            const assertFolderPath = path.join(
                settings.PROJECT_DIR,
                "public",
                "assets"
            );

            if (!fs.existsSync(assertFolderPath)) {
                fs.mkdirSync(assertFolderPath, { recursive: true });
            }

            cb(null, assertFolderPath);
        },
        filename: function (req, file, cb) {
            const lastDot = file.originalname.lastIndexOf(".");
            const ext = file.originalname.substring(lastDot + 1);

            const timestamp = new Date().getTime();
            const underscoredName = `${timestamp}_${file.originalname}`;

            cb(null, underscoredName);
        },
    });

    // File type validation
    const fileFilter = (req, file, cb) => {
        const allowedFileTypes = ["jpeg", "png", "jpg"];
        const file_extension = file.originalname.slice(
            ((file.originalname.lastIndexOf(".") - 1) >>> 0) + 2
        );
        if (allowedFileTypes.includes(file_extension)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Invalid file type. Only JPEG, PNG & JPG images are allowed."
                )
            );
        }
    };

    // Image size validation
    const limits = {
        fileSize: 1024 * 1024 * 2, // 2 MB
        fileTooLargeMsg: "File size exceeds the allowed limit of 2 MB.",
    };

    // Initialize multer with the defined settings
    const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: limits,
    });

    // Middleware for handling file upload
    const uploadMiddleware = (req, res, next) => {
        upload.single(fieldName)(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res
                        .status(400)
                        .json({ error: limits.fileTooLargeMsg });
                } else {
                    return res.status(400).json({ error: err.message });
                }
            } else if (err) {
                // An unknown error occurred
                return res.status(500).json({ error: err.message });
            }
            next();
        });
    };

    return uploadMiddleware;
};

module.exports = createUploadMiddleware;
