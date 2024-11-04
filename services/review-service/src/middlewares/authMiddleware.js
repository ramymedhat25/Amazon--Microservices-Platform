const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      logger.warn("Access denied: No token provided");
      return res
        .status(401)
        .json({ error: "Access denied: No token provided" });
    }

    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Check if the user's role is authorized
      if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
        logger.warn(`Access denied: User role ${req.user.role} not authorized`);
        return res.status(403).json({ error: "Access denied: Not authorized" });
      }

      next(); // User is authenticated and authorized
    } catch (error) {
      logger.error(`Invalid token: ${error.message}`, { stack: error.stack });
      return res.status(400).json({ error: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;
