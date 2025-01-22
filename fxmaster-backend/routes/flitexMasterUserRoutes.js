const express = require("express");
const route = express();
const { schemaValidation } = require("../middleware/validation");
const {
    createFlitexMasterUser,
    updateFlitexMasterUser,
    listAllFlitexMasterUsers,
    deleteFlitexMasterUser,
    getFlitexMasterById,
    updateFlitexMasterUserStatus,
    deleteMultipleFlitexMasterUser,
    exportFlitexMasterUserData,
} = require("../controllers/flitexMasterUserController");
const {
    createFlitexMasterUserSchema,
    updateFlitexMasterUserSchema,
} = require("../schemas/flitexMasterUserSchema");
const createUploadMiddleware = require("../middleware/fileUpload");
const tokenAuthentication =
    require("../middleware/authentication").authenticateToken;
const uploadProfilePicMiddleware = createUploadMiddleware("profilePic");

route.post(
    "/",
    uploadProfilePicMiddleware,
    schemaValidation(createFlitexMasterUserSchema),
    tokenAuthentication,
    createFlitexMasterUser
);
route.put(
    "/:id",
    uploadProfilePicMiddleware,
    schemaValidation(updateFlitexMasterUserSchema),
    tokenAuthentication,
    updateFlitexMasterUser
);
route.get("/", tokenAuthentication, listAllFlitexMasterUsers);
route.delete("/:id", tokenAuthentication, deleteFlitexMasterUser);
route.get("/:id", tokenAuthentication, getFlitexMasterById);
route.put(
    "/update-user-status/:id",
    tokenAuthentication,
    updateFlitexMasterUserStatus
);
route.put("/", tokenAuthentication, deleteMultipleFlitexMasterUser);
route.post(
    "/export-flitex-Master-User",
    tokenAuthentication,
    exportFlitexMasterUserData
);

module.exports = route;
