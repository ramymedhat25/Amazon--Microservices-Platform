const jwt = require("jsonwebtoken");
const { sendResponse } = require("../utils/helpers");


const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return sendResponse(res, 401, "Access denied");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return sendResponse(res, 400, "Invalid token");
  }
};

module.exports = authMiddleware;