const { Sequelize, sequelize } = require("../config/connection");
const { createErrorLog } = require("../utiles/logmanager/logger");
const { insertLog } = require("../controllers/systemLogController");

const listGlobalSettings = async (req, res) => {
    try {
        const settings = await sequelize.query(
            `
          SELECT id, name, value, isActive FROM setting
          WHERE isDeleted = 0
          ORDER BY id ASC
        `,
            {
                type: Sequelize.QueryTypes.SELECT,
            }
        );
        return res.status(200).json({
            status: 200,
            message: "Setting data retrieved successfully.",
            settings,
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "List",
            "Global Settings",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

const updateGlobalSetting = async (req, res) => {
    try {
        const data = req.body;
        for (const [name, value] of Object.entries(data)) {
            const result = await sequelize.query(
                "EXEC updateSettingData @name = :name, @value = :value",
                {
                    replacements: {
                        name: name,
                        value: value,
                    },
                    type: Sequelize.QueryTypes.RAW,
                }
            );

            const updatedSetting = result[0][0];

            insertLog(
                `${updatedSetting.Id}`,
                `Update ${updatedSetting.name}`,
                "Global Settings",
                req.user.id,
                updatedSetting.value
            );
        }
        return res.status(200).json({
            status: 200,
            message: "Setting data updated successfully",
        });
    } catch (error) {
        createErrorLog(
            error.message,
            "Update",
            "Global Settings",
            req.user.id,
            req.user.email
        );
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" });
    }
};

module.exports = {
    updateGlobalSetting,
    listGlobalSettings,
};
