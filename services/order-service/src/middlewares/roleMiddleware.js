const roleMiddleware = (allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.userRole)) {
    return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
  }
  next();
};

module.exports = roleMiddleware;
