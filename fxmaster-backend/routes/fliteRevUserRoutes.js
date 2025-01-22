const express = require("express");
const route = express();
const { schemaValidation } = require("../middleware/validation");
const {
    createUser,
    updateUser,
    listAllUsers,
    getUserById,
    deleteUser,
    updateUserStatus,
    deleteMultipleUser,
    exportFlitexRevUserData,
} = require("../controllers/fliteRevUserController");
const {
    createFliteRevUserSchema,
    updateFliteRevUserSchema,
} = require("../schemas/fliteRevUserSchema");
const createUploadMiddleware = require("../middleware/fileUpload");
const tokenAuthentication =
    require("../middleware/authentication").authenticateToken;
const uploadFlagMiddleware = createUploadMiddleware("profilePic");

route.post(
    "/",
    uploadFlagMiddleware,
    schemaValidation(createFliteRevUserSchema),
    tokenAuthentication,
    createUser
);
route.put(
    "/:id",
    uploadFlagMiddleware,
    schemaValidation(updateFliteRevUserSchema),
    tokenAuthentication,
    updateUser
);
route.get("/", tokenAuthentication, listAllUsers);
route.delete("/:id", tokenAuthentication, deleteUser);
route.get("/:id", tokenAuthentication, getUserById);
route.put("/update-user-status/:id", tokenAuthentication, updateUserStatus);
route.put("/", tokenAuthentication, deleteMultipleUser);
route.post(
    "/export-flite-Rev-User",
    tokenAuthentication,
    exportFlitexRevUserData
);

module.exports = route;
