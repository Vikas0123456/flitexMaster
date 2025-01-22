const Joi = require("joi");

const insertMtowSchema = Joi.object().keys({
    aircraftType: Joi.number().required().messages({
        'string.empty': "Please enter aircraftType"
    }),
    mtow: Joi.number().required().messages({
        'number.base': 'Please enter a valid number for mtow',
        'any.required': 'Please enter mtow',
    }),
    isActive: Joi.boolean().default(true)
});

const updateMtowSchema = Joi.object().keys({
    aircraftType: Joi.number().messages({
        "number.empty": "Please enter aircraftType",
    }),
    mtow: Joi.number().messages({
        'number.base': 'Please enter a valid number for mtow',
        'any.required': 'Please enter mtow',
    }),
    isActive: Joi.boolean().default(true)
})

module.exports = {
    insertMtowSchema,
    updateMtowSchema
};