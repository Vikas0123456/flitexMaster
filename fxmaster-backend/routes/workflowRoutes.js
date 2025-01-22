const express = require("express");
const router = express.Router();
const {
    createWorkflow,
    getWorkflows,
    listWorkflow,
    getWorkflowById,
    updateWorkflow,
    deleteWorkflow,
    multipleDeleteWorkflow,
    updateWorkflowStatus,
    getAirline,
    createAirline,
    getUsers,
    getRoles,
} = require("../controllers/workflowController");
const { schemaValidation } = require("../middleware/validation");
const {
    createUpdateWorkflowSchema,
    updateWorkflowStatusSchema,
} = require("../schemas/workflowSchema");

//workflow
router.post(
    "/upload-workflow",
    schemaValidation(createUpdateWorkflowSchema),
    createWorkflow
);
router.get("/get-workflow", getWorkflows);
router.get("/list-workflow", listWorkflow);
router.get("/workflow/:id", getWorkflowById);
router.put(
    "/update-workflow/:id",
    schemaValidation(createUpdateWorkflowSchema),
    updateWorkflow
);
router.delete("/delete-workflow/:id", deleteWorkflow);
router.delete("/multiple-delete-workflow", multipleDeleteWorkflow);
router.post(
    "/update-status-workflow/:id",
    schemaValidation(updateWorkflowStatusSchema),
    updateWorkflowStatus
);

//airline
router.get("/get-airline", getAirline);
router.post("/create-airline", createAirline);

//users
router.get("/get-users", getUsers);

//roles
router.get("/get-roles", getRoles);

module.exports = router;
