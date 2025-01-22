const { sequelize } = require("../config/connection");
const workflow = require("../models/workflowModel");

//workflow api section//

const createWorkflow = async (req, res) => {
    try {
        const data = req.body;

        const userQuery = `
            SELECT id FROM users WHERE id = :userId
        `;
        const [user] = await sequelize.query(userQuery, {
            replacements: { userId: data.userId },
        });
        if (!user || user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const roleQuery = `
            SELECT id FROM roles WHERE id = :roleId
        `;
        const [role] = await sequelize.query(roleQuery, {
            replacements: { roleId: data.roleId },
        });
        if (!role || role.length === 0) {
            return res.status(404).json({ message: "Role not found" });
        }

        const insertQuery = `
            INSERT INTO workflow (workflowName, roleId, userId, isActive)
            VALUES (:workflowName, :roleId, :userId, :isActive)
        `;
        await sequelize.query(insertQuery, {
            replacements: {
                workflowName: data.workflowName,
                roleId: data.roleId,
                userId: data.userId,
                isActive: data.isActive,
            },
        });

        return res.status(200).json({
            message: "Workflow created successfully...",
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong. Please try again later",
            error: error.message,
        });
    }
};

const getWorkflowss = async (req, res) => {
    try {
        const workflowsQuery = `
            SELECT * FROM workflow WHERE isDeleted = 0 AND isActive = 1
        `;
        const workflows = await sequelize.query(workflowsQuery, {
            type: sequelize.QueryTypes.SELECT,
        });

        if (!workflows) {
            return res.status(404).json({ message: "Workflows not found" });
        }

        const countQuery = `
        SELECT COUNT(*) AS totalCount FROM workflow
    `;
        const [{ totalCount }] = await sequelize.query(countQuery, {
            type: sequelize.QueryTypes.SELECT,
        });

        return res.status(200).json({
            totalCount,
            message: "Workflow retreived successfully...",
            workflows,
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong. Please try again later",
            error: error.message,
        });
    }
};

const listWorkflow = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const workflowsQuery = `
            SELECT * FROM (
                SELECT *, ROW_NUMBER() OVER (ORDER BY id) AS RowNum
                FROM workflow
            ) AS SubQuery
            WHERE RowNum BETWEEN :startRow AND :endRow
        `;
        const workflows = await sequelize.query(workflowsQuery, {
            replacements: {
                startRow: offset + 1,
                endRow: offset + parseInt(limit),
            },
            type: sequelize.QueryTypes.SELECT,
        });

        if (!workflows) {
            return res.status(404).json({ message: "Workflows not found" });
        }

        const countQuery = `
            SELECT COUNT(*) AS totalCount FROM workflow
        `;
        const [{ totalCount }] = await sequelize.query(countQuery, {
            type: sequelize.QueryTypes.SELECT,
        });

        return res.status(200).json({
            totalCount,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / limit),
            message: "Workflow retrieved successfully...",
            workflows,
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong. Please try again later",
            error: error.message,
        });
    }
};

const getWorkflowById = async (req, res) => {
    try {
        const { id } = req.params;

        const workflowQuery = `
            SELECT * FROM workflow WHERE id = :id
        `;
        const [workflow] = await sequelize.query(workflowQuery, {
            replacements: { id },
            type: sequelize.QueryTypes.SELECT,
        });

        if (!workflow) {
            return res.status(404).json({ message: "Workflow not found" });
        }

        res.status(200).json({
            message: "Workflow retreived successfully...",
            workflow,
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong. Please try again later",
            error: error.message,
        });
    }
};

const updateWorkflow = async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;

        const workflowQuery = `
            SELECT id FROM workflow WHERE id = :id
        `;
        const [existingWorkflow] = await sequelize.query(workflowQuery, {
            replacements: { id },
            type: sequelize.QueryTypes.SELECT,
        });

        if (!existingWorkflow) {
            return res.status(404).json({ message: "Workflow not found" });
        }

        const updateQuery = `
            UPDATE workflow
            SET workflowName = :workflowName, roleId = :roleId, userId = :userId, isActive = :isActive
            WHERE id = :id
        `;
        await sequelize.query(updateQuery, {
            replacements: {
                id,
                ...newData,
            },
        });

        return res
            .status(200)
            .json({ message: "Workflow updated successfully..." });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong. Please try again later",
            error: error.message,
        });
    }
};

const deleteWorkflow = async (req, res) => {
    try {
        const { id } = req.params;

        const workflowQuery = `
            SELECT * FROM workflow WHERE id = :id
        `;
        const [workflow] = await sequelize.query(workflowQuery, {
            replacements: { id },
            type: sequelize.QueryTypes.SELECT,
        });

        if (!workflow) {
            return res.status(404).json({ message: "Workflow not found" });
        }

        const updateQuery = `
            UPDATE workflow SET isDeleted = 1 WHERE id = :id
        `;
        await sequelize.query(updateQuery, {
            replacements: { id },
        });

        return res
            .status(200)
            .json({ message: "Workflow deleted successfully..." });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong. Please try again later",
            error: error.message,
        });
    }
};

const multipleDeleteWorkflow = async (req, res) => {
    try {
        const { ids } = req.body;

        const workflowsQuery = `
            SELECT id FROM workflow WHERE id IN (:ids)
        `;
        const existingWorkflows = await sequelize.query(workflowsQuery, {
            replacements: { ids },
            type: sequelize.QueryTypes.SELECT,
        });

        if (existingWorkflows.length === 0) {
            return res.status(404).json({ message: "No workflows found" });
        }

        const updateQuery = `
            UPDATE workflow SET isDeleted = 1 WHERE id IN (:ids)
        `;
        await sequelize.query(updateQuery, {
            replacements: { ids },
        });

        return res.status(200).json({
            message: "Selected workflows deleted successfully...",
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong. Please try again later",
            error: error.message,
        });
    }
};

const updateWorkflowStatus = async (req, res) => {
    try {
        const id = req.params.id;

        const workflowQuery = `SELECT * FROM workflow WHERE id = :id`;
        const [workflow] = await sequelize.query(workflowQuery, {
            replacements: { id },
            type: sequelize.QueryTypes.SELECT,
        });

        if (!workflow) {
            return res.status(404).json({
                status: 404,
                message: "Workflow does not exist",
            });
        }

        const isActive = !workflow.isActive;
        await sequelize.query(
            "UPDATE workflow SET isActive = :isActive WHERE id = :id",
            {
                replacements: { isActive, id },
                type: sequelize.QueryTypes.UPDATE,
            }
        );

        return res.status(200).json({
            status: 200,
            message: "Workflow status updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong! Please try again later",
            error: error.message,
        });
    }
};

//airline api section//

const getAirline = async (req, res) => {
    try {
        const airlineQuery = `
            SELECT * FROM airline
        `;
        const airlines = await sequelize.query(airlineQuery, {
            type: sequelize.QueryTypes.SELECT,
        });

        return res
            .status(200)
            .json({ message: "airlines retreived successfully...", airlines });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong. Please try again later",
            error: error.message,
        });
    }
};

const createAirline = async (req, res) => {
    try {
        const data = req.body;

        const insertQuery = `
            INSERT INTO airline (airlineName, isActive)
            VALUES (:airlineName, :isActive)
        `;
        const [result] = await sequelize.query(insertQuery, {
            replacements: {
                airlineName: data.airlineName,
                isActive: data.isActive || true,
            },
        });

        res.status(200).json({
            message: "Airline created successfully...",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong. Please try again later",
            error: error.message,
        });
    }
};

//users api section//

const getUsers = async (req, res) => {
    try {
        const usersQuery = `
            SELECT * FROM users
        `;
        const users = await sequelize.query(usersQuery, {
            type: sequelize.QueryTypes.SELECT,
        });

        return res
            .status(200)
            .json({ message: "Users retreived successfully...", users });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong. Please try again later",
            error: error.message,
        });
    }
};

//roles api section//

const getRoles = async (req, res) => {
    try {
        const rolesQuery = `
            SELECT * FROM roles
        `;
        const roles = await sequelize.query(rolesQuery, {
            type: sequelize.QueryTypes.SELECT,
        });

        return res
            .status(200)
            .json({ message: "Users retreived successfully...", roles });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong. Please try again later",
            error: error.message,
        });
    }
};

const getWorkflows = async (req, res) => {
    try {
        const workflowsQuery = `
        SELECT r.id AS roleId, w.workflowName, w.isActive AS workflowIsActive, 
        w.isDeleted AS workflowIsDeleted, u.firstName, u.lastName, r.roleName
        FROM roles r
        JOIN workflow w ON r.id = w.roleId
        JOIN users u ON w.userId = u.id
        WHERE w.isDeleted = 0 AND w.isActive = 1;
        `;
        const workflows = await sequelize.query(workflowsQuery, {
            type: sequelize.QueryTypes.SELECT,
        });

        if (!workflows || workflows.length === 0) {
            return res.status(404).json({ message: "Workflows not found" });
        }

        const totalCountQuery = `
            SELECT COUNT(*) AS totalCount FROM workflow
            WHERE isDeleted = 0 AND isActive = 1;
        `;
        const [{ totalCount }] = await sequelize.query(totalCountQuery, {
            type: sequelize.QueryTypes.SELECT,
        });

        return res.status(200).json({
            totalCount,
            message: "Workflows retrieved successfully...",
            workflows,
        });
    } catch (error) {
        console.error("Error in getWorkflows:", error);
        res.status(500).json({
            message: "Something went wrong. Please try again later",
            error: error.message,
        });
    }
};

module.exports = {
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
};
