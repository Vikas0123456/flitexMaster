const express = require("express");
const {
    userLogin,
    sentResetPasswordMail,
    resetUserPassword,
    changePassword,
    confirmOtp,
    changeFlitexMasterUserProfile,
    getFlitexMasterUserProfileDetails,
} = require("../controllers/authController");
const route = express.Router();
const { schemaValidation } = require("../middleware/validation");
const {
    emailSchema,
    loginSchema,
    updatePassword,
} = require("../schemas/userSchema");
const createUploadMiddleware = require("../middleware/fileUpload");
const tokenAuthentication =
    require("../middleware/authentication").authenticateToken;
const uploadProfilePicMiddleware = createUploadMiddleware("profilePic");

route.post("/login", schemaValidation(loginSchema), userLogin);
route.post(
    "/reset-password-eamil",
    schemaValidation(emailSchema),
    sentResetPasswordMail
);
route.post("/verify-otp", confirmOtp);
route.post("/change-password", tokenAuthentication, changePassword);
route.put("/set-password", schemaValidation(updatePassword), resetUserPassword);
route.post(
    "/change-profile",
    tokenAuthentication,
    uploadProfilePicMiddleware,
    changeFlitexMasterUserProfile
);
route.get(
    "/get-user-profile",
    tokenAuthentication,
    getFlitexMasterUserProfileDetails
);

module.exports = route;
