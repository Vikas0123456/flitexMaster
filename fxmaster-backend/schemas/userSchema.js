const Joi = require("joi");

const loginSchema = Joi.object({
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
});

const emailSchema = Joi.object({
    email: Joi.string()
        .email()
        .pattern(/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .required()
        .messages({
            "string.email": "Please enter valid email",
            "string.empty": "Please enter email",
        }),
});

const updatePassword = Joi.object({
    newPassword: Joi.string()
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
    confirmNewPassword: Joi.any()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
            "any.only": "Confirm password should match with the password field",
            "any.required": "Confirm password is required",
        }),
    token: Joi.string().required().messages({
        "string.empty": "Token is Required",
    }),
});

module.exports = {
    loginSchema,
    emailSchema,
    updatePassword,
};
