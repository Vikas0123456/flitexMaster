const Joi = require("joi");

const createCountrySchema = Joi.object().keys({
    countryCode: Joi.string()
        .max(3)
        .min(2)
        .pattern(/^[a-zA-Z]+$/)
        .required()
        .messages({
            "string.empty": "Please enter countryCode",
            "string.min":
                "Country code should have at least {#limit} characters",
            "string.max": "Country code should not exceed {#limit} characters",
        }),
    countryName: Joi.string()
        .pattern(/^[a-zA-Z\s]+$/)
        .max(30)
        .required()
        .messages({
            "string.empty": "Please enter countryName",
            "string.max": "Country Name should not exceed {#limit} characters",
            "string.pattern.base":
                "Country Name should contain only alphabetical characters and spaces",
        }),
    flag: Joi.any().messages({
        "any.empty": "Please select flag",
    }),
    isActive: Joi.boolean().default(true),
});

const updateCountrySchema = Joi.object().keys({
    countryCode: Joi.string()
        .max(3)
        .min(2)
        .pattern(/^[a-zA-Z]+$/)
        .messages({
            "string.empty": "Please enter countryCode",
            "string.min":
                "Country code should have at least {#limit} characters",
            "string.max": "Country code should not exceed {#limit} characters",
        }),
    countryName: Joi.string()
        .pattern(/^[a-zA-Z\s]+$/)
        .max(30)
        .messages({
            "string.empty": "Please enter countryName",
            "string.max": "Country Name should not exceed {#limit} characters",
            "string.pattern.base":
                "Country Name should contain only alphabetical characters and spaces",
        }),
    flag: Joi.any().messages({
        "any.empty": "Please select flag",
    }),
    isActive: Joi.boolean().default(true),
    isImageEdited: Joi.boolean().default(false),
    filename: Joi.string().required().messages({
        "string.empty": "Please select file",
    }),
});

module.exports = {
    createCountrySchema,
    updateCountrySchema,
};
