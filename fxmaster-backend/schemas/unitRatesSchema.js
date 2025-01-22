const Joi = require("joi");

const insertUnitRateSchema = Joi.object().keys({
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
    dateFrom: Joi.date().required().messages({
        "date.empty": "Please enter dateFrom",
    }),
    dateTo: Joi.date().required().messages({
        "date.empty": "Please enter dateTo",
    }),
    unitRate: Joi.number().required().messages({
        "number.empty": "Please enter unitRate",
    }),
    currency: Joi.string().required().messages({
        "string.empty": "Please enter currency",
    }),
    countryId: Joi.number().required().messages({
        "number.empty": "Please enter country",
    }),
    isActive: Joi.boolean().default(true),
});

const updateUnitRateSchema = Joi.object().keys({
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
    dateFrom: Joi.date().messages({
        "date.empty": "Please enter dateFrom",
    }),
    dateTo: Joi.date().messages({
        "date.empty": "Please enter dateTo",
    }),
    unitRate: Joi.number().messages({
        "number.empty": "Please enter unitRate",
    }),
    currency: Joi.string().messages({
        "string.empty": "Please enter currency",
    }),
    countryId: Joi.number().messages({
        "number.empty": "Please enter country",
    }),
    isActive: Joi.boolean().default(true),
});

module.exports = {
    insertUnitRateSchema,
    updateUnitRateSchema,
};
