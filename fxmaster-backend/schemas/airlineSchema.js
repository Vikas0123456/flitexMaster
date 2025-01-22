const Joi = require("joi");

const personDetailInsertSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Please enter name",
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
    contactNumber: Joi.string().required().messages({
        "string.empty": "Please enter contactNumber",
    }),
});

const createAirlineSchema = Joi.object().keys({
    callSign: Joi.string().required().messages({
        "string.empty": "Please enter callSign",
    }),
    countryId: Joi.number().required().messages({
        "number.empty": "Please enter country",
    }),
    iata: Joi.string().required().messages({
        "string.empty": "Please enter iata",
    }),
    airlineName: Joi.string().required().messages({
        "string.empty": "Please enter airlineName",
    }),
    airlineLogo: Joi.string(),
    personDetail: Joi.any()
        .optional()
        .custom((value, helpers) => {
            const parsedValue = JSON.parse(value);
            const validationResult = Joi.array()
                .items(personDetailInsertSchema)
                .validate(parsedValue);
            if (validationResult.error) {
                throw new Error(validationResult.error.message);
            }

            return parsedValue;
        }),
    personDetail: Joi.any(),
    address: Joi.string().required().messages({
        "string.empty": "Please enter address",
    }),
    bankAccount: Joi.string()
        .regex(/^[0-9]+$/)
        .min(8)
        .max(20)
        .required()
        .messages({
            "string.empty": "Please enter bank account number",
            "string.min":
                "Bank account number should not exceed {#limit} characters",
            "string.max":
                "Bank account number should not exceed {#limit} characters",
            "string.pattern.base":
                "Bank account number should only contain numeric characters",
        }),
    bankName: Joi.string()
        .regex(/^[A-Za-z][A-Za-z\s]*[A-Za-z]$/)
        .max(60)
        .required()
        .messages({
            "string.empty": "Please enter bank name",
            "string.max": "Bank name should not exceed {#limit} characters",
            "string.pattern.base": "Invalid bank Name format",
        }),
    swiftCode: Joi.string()
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
    isActive: Joi.boolean().default(true),
});

const personDetailUpdateSchema = Joi.object({
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
    contactNumber: Joi.string().messages({
        "string.empty": "Please enter contactNumber",
    }),
});
const updateAirlineSchema = Joi.object({
    callSign: Joi.string().messages({
        "string.empty": "Please enter callSign",
    }),
    countryName: Joi.string().max(30).messages({
        "string.empty": "Please enter countryName",
        "string.max": "Country Name should not exceed {#limit} characters",
    }),
    countryId: Joi.number().messages({
        "number.empty": "Please enter country",
    }),
    iata: Joi.string().messages({
        "string.empty": "Please enter iata",
    }),
    airlineName: Joi.string().messages({
        "string.empty": "Please enter airlineName",
    }),
    airlineLogo: Joi.string(),
    personDetail: Joi.any()
        .optional()
        .custom((value, helpers) => {
            const parsedValue = JSON.parse(value);
            const validationResult = Joi.array()
                .items(personDetailUpdateSchema)
                .validate(parsedValue);
            if (validationResult.error) {
                throw new Error(validationResult.error.message);
            }

            return parsedValue;
        }),
    address: Joi.string().required().messages({
        "string.empty": "Please enter address",
    }),
    bankAccount: Joi.string()
        .regex(/^[0-9]+$/)
        .max(20)
        .messages({
            "string.empty": "Please enter bank account",
            "string.max": "Bank account should not exceed {#limit} characters",
            "string.pattern.base":
                "Bank account should only contain numeric characters",
        }),
    bankName: Joi.string()
        .regex(/^[A-Za-z][A-Za-z\s]*[A-Za-z]$/)
        .max(60)
        .messages({
            "string.empty": "Please enter bank name",
            "string.max": "Bank name should not exceed {#limit} characters",
            "string.pattern.base": "Invalid bank Name format",
        }),
    swiftCode: Joi.string()
        .regex(/^[a-zA-Z0-9]+$/)
        .min(8)
        .max(12)
        .messages({
            "string.empty": "Please enter SWIFT code",
            "string.min": "SWIFT code should have at least {#limit} characters",
            "string.max": "SWIFT code should not exceed {#limit} characters",
            "string.pattern.base": "Invalid SWIFT code format",
        }),
    isActive: Joi.boolean().default(true),
});

module.exports = {
    createAirlineSchema,
    updateAirlineSchema,
};
