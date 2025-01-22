const jwt = require("jsonwebtoken");
const { sequelize, Sequelize } = require("../config/connection");

const authenticateToken = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res
            .status(401)
            .json({ status: 401, message: "Unauthorized - No token provided" });
    }

    jwt.verify(token, process.env.SECRECT_KEY, async (err, paylod) => {
        if (err) {
            return res.status(401).json({
                status: 401,
                message: "Forbidden - Invalid token",
            });
        }

        const expirationTime = 7 * 24 * 60 * 60;
        if (
            paylod.exp &&
            paylod.exp <= Math.floor(Date.now() / 1000) - expirationTime
        ) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized - Token has expired",
            });
        }

        const user = await sequelize.query(
            "EXEC getFlitexMasterUserById @id = :id",
            {
                replacements: {
                    id: paylod.id,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );

        if (user[0].length > 0 && user[0][0].isActive) {
            req.user = user[0][0]; // Attach the decoded paylod information to the request object
            next();
        } else {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized - Please login again",
            });
        }
    });
};

module.exports = { authenticateToken };
