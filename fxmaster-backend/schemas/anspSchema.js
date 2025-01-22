const Joi = require("joi");

const createAnspSchema = Joi.object().keys({
    name: Joi.string().max(100).required().messages({
        "string.empty": "Please enter name",
        "string.max":
            "name length must be less than or equal to 100 characters long",
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
    phoneNumber: Joi.string().required().messages({
        "string.empty": "Please enter phoneNumber",
    }),
    faxNumber: Joi.string().required().messages({
        "string.empty": "Please enter faxNumber",
    }),
    logo: Joi.any().messages({
        "any.empty": "Please select logo",
    }),
    address: Joi.string().messages({
        "string.empty": "Please enter address",
    }),
    website: Joi.string().allow(""),
    bankName: Joi.string().required().messages({
        "string.empty": "Please enter bank name",
    }),
    bankAccountNumber: Joi.string().required().messages({
        "string.empty": "Please enter bank account number",
    }),
    swiftcode: Joi.string()
        .regex(/^[a-zA-Z0-9]+$/)
        .min(8)
        .max(12)
        .required()
        .messages({
            "string.empty": "Please enter SWIFT code",
            "string.min": "SWIFT code should have at least {#limit} characters",
            "string.max": "SWIFT code should not exceed {#limit} characters",
            "string.pattern.base": "Invalid SWIFT code format",
        }),
    isActive: Joi.boolean().default(true).optional(),
});

const updateAnspSchema = Joi.object().keys({
    name: Joi.string().max(50).messages({
        "string.empty": "Please enter name",
        "string.max":
            "name length must be less than or equal to 50 characters long",
    }),
    email: Joi.string()
        .email()
        .max(50)
        .pattern(/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .messages({
            "string.email": "Please enter valid email",
            "string.empty": "Please enter email",
        }),
    phoneNumber: Joi.string().messages({
        "string.empty": "Please enter Phone Number",
    }),
    faxNumber: Joi.string().messages({
        "string.empty": "Please enter website",
    }),
    logo: Joi.any().messages({
        "any.empty": "Please select logo",
    }),
    address: Joi.string().messages({
        "string.empty": "Please enter address",
    }),
    website: Joi.string().allow(""),
    bankName: Joi.string().messages({
        "string.empty": "Please enter bank name",
    }),
    bankAccountNumber: Joi.string().messages({
        "string.empty": "Please enter bank account number",
    }),
    swiftcode: Joi.string().messages({
        "string.empty": "Please enter SWIFT code",
    }),
    isImageEdited: Joi.boolean().default(false),
    filename: Joi.string().required().messages({
        "string.empty": "Please select file",
    }),
    isActive: Joi.boolean().default(true).optional(),
});

module.exports = {
    createAnspSchema,
    updateAnspSchema,
};
