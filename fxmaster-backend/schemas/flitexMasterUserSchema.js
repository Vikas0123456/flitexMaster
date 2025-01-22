const Joi = require("joi");

const createFlitexMasterUserSchema = Joi.object().keys({
    firstName: Joi.string().required().messages({
        "string.empty": "Please enter First Name",
    }),
    lastName: Joi.string().required().messages({
        "string.empty": "Please enter Last Name",
    }),
    email: Joi.string()
        .email()
        .pattern(/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .required()
        .messages({
            "string.email": "Please enter valid email",
            "string.empty": "Please enter email",
        }),
    password: Joi.string()
        .min(8)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
        )
        .required()
        .messages({
            "string.min": "Password must be at least 8 characters long",
            "string.pattern.base":
                "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
            "any.required": "Password is required",
        }),
    profilePic: Joi.any().messages({
        "any.empty": "Please select Profile Pic",
    }),
    isActive: Joi.boolean().default(true),
    isAdmin: Joi.string().default("0"),
});

const updateFlitexMasterUserSchema = Joi.object().keys({
    firstName: Joi.string().required().messages({
        "string.empty": "Please enter First Name",
    }),
    lastName: Joi.string().required().messages({
        "string.empty": "Please enter Last Name",
    }),
    email: Joi.string()
        .email()
        .pattern(/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .required()
        .messages({
            "string.email": "Please enter valid email",
            "string.empty": "Please enter email",
        }),
    password: Joi.string().required().messages({
        "any.required": "Password is required",
    }),
    profilePic: Joi.any().messages({
        "any.empty": "Please select Profile Pic",
    }),
    isActive: Joi.boolean().default(true),
    isAdmin: Joi.string().default("0"),
    isImageEdited: Joi.boolean().default(false),
    filename: Joi.string().required().messages({
        "string.empty": "Please select file",
    }),
    isPasswordEdited: Joi.boolean().default(false),
});

module.exports = {
    createFlitexMasterUserSchema,
    updateFlitexMasterUserSchema,
};
