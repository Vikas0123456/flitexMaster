const Joi = require("joi");

const createAircraftSchema = Joi.object().keys({
    aircraftType: Joi.string().required().messages({
        "string.empty": "Please enter aircraftType",
    }),
    aircraftModel: Joi.string().required().messages({
        "string.empty": "Please enter aircraftModel",
    }),
    serialNumber: Joi.string().required().messages({
        "string.empty": "Please enter serialNumber",
    }),
    registrationYear: Joi.string().required().messages({
        "string.empty": "Please enter registration year",
    }),
    mtow: Joi.number().positive().required().messages({
        "number.base": "Please enter a valid number for MTOW",
        "number.positive": "MTOW must be a positive number",
        "any.required": "MTOW is required",
    }),
    tailNumber: Joi.string().required().messages({
        "string.empty": "Please enter tailNumber",
    }),
    isActive: Joi.boolean().default(true),
});

const updateAircraftSchema = Joi.object().keys({
    aircraftType: Joi.string().messages({
        "string.empty": "Please enter aircraftType",
    }),
    aircraftModel: Joi.string().messages({
        "string.empty": "Please enter aircraftModel",
    }),
    serialNumber: Joi.string().messages({
        "string.empty": "Please enter serialNumber",
    }),
    registrationYear: Joi.string().messages({
        "string.empty": "Please enter registration year",
    }),
    mtow: Joi.string().messages({
        "string.empty": "Please enter MTOW",
    }),
    tailNumber: Joi.string().messages({
        "string.empty": "Please enter tailNumber",
    }),
    isActive: Joi.boolean().default(true),
});

module.exports = {
    createAircraftSchema,
    updateAircraftSchema,
};
