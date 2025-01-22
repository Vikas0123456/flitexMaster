const Joi = require("joi");

const createUpdateWorkflowSchema = Joi.object({
    workflowName: Joi.string().required().messages({
        "string.empty": "Please enter Workflow Name",
    }),
    roleId: Joi.number().required().messages({
        "number.empty": "Please enter role ID",
    }),
    userId: Joi.number().required().messages({
        "number.empty": "Please enter user ID",
    }),
    isActive: Joi.boolean().default(true),
});

const updateWorkflowStatusSchema = Joi.object({
    isActive: Joi.boolean().default(true),
});

module.exports = {
    createUpdateWorkflowSchema,
    updateWorkflowStatusSchema,
};
