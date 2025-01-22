const Joi = require("joi");

const createFliteRevUserSchema = Joi.object().keys({
    airlineIds: Joi.string().required().messages({
        "string.empty": "Please enter country",
    }),
    userName: Joi.string().max(50).required().messages({
        "string.empty": "Please enter userName",
        "string.max":
            "userName length must be less than or equal to 50 characters long",
    }),
    firstName: Joi.string().max(50).required().messages({
        "string.empty": "Please enter First Name",
        "string.max":
            "First Name length must be less than or equal to 50 characters long",
    }),
    lastName: Joi.string().max(50).required().messages({
        "string.empty": "Please enter Last Name",
        "string.max":
            "Last Name length must be less than or equal to 50 characters long",
    }),
    email: Joi.string()
        .email()
        .max(50)
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
    domain: Joi.string().required().messages({
        "string.empty": "Please enter domain",
    }),
    profilePic: Joi.any().messages({
        "any.empty": "Please select Profile Pic",
    }),
    isActive: Joi.boolean().default(true),
});

const updateFliteRevUserSchema = Joi.object().keys({
    airlineIds: Joi.string().required().messages({
        "string.empty": "Please enter country",
    }),
    userName: Joi.string().max(50).messages({
        "string.empty": "Please enter userName",
        "string.max":
            "userName length must be less than or equal to 50 characters long",
    }),
    firstName: Joi.string().max(50).required().messages({
        "string.empty": "Please enter First Name",
        "string.max":
            "First Name length must be less than or equal to 50 characters long",
    }),
    lastName: Joi.string().max(50).required().messages({
        "string.empty": "Please enter Last Name",
        "string.max":
            "Last Name length must be less than or equal to 50 characters long",
    }),
    email: Joi.string()
        .email()
        .max(50)
        .pattern(/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .messages({
            "string.email": "Please enter valid email",
            "string.empty": "Please enter email",
        }),
    password: Joi.string().required().messages({
        "any.required": "Password is required",
    }),
    domain: Joi.string().required().messages({
        "string.empty": "Please enter domain",
    }),
    profilePic: Joi.any().messages({
        "any.empty": "Please select Profile Pic",
    }),
    isActive: Joi.boolean().default(true),
    isImageEdited: Joi.boolean().default(false),
    filename: Joi.string().messages({
        "string.empty": "Please select file",
    }),
    isPasswordEdited: Joi.boolean().default(false),
});

module.exports = {
    createFliteRevUserSchema,
    updateFliteRevUserSchema,
};
