const Joi = require("joi");

const insertCurrencySchema = Joi.object().keys({
    country: Joi.number().required().messages({
        "number.empty": "Please enter countryId",
    }),
    currencyCode: Joi.string().required().messages({
        "string.empty": "Please enter countryCode",
    }),
    currencyName: Joi.string().required().messages({
        "string.empty": "Please enter currencyName",
    }),
    exchangeRateToUsd: Joi.number().required().messages({
        "number.empty": "Please enter exchangeRateToUsd",
    }),
    isActive: Joi.boolean().default(true),
});

const updateCurrencySchema = Joi.object().keys({
    country: Joi.number().messages({
        "number.empty": "Please enter countryId",
    }),
    currencyCode: Joi.string().messages({
        "string.empty": "Please enter countryCode",
    }),
    currencyName: Joi.string().messages({
        "string.empty": "Please enter currencyName",
    }),
    exchangeRateToUsd: Joi.number().messages({
        "number.empty": "Please enter exchangeRateToUsd",
    }),
    isActive: Joi.boolean().default(true),
});

module.exports = {
    insertCurrencySchema,
    updateCurrencySchema,
};
