const express = require("express");
const { register, login, getUsers } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// User routes
router.get("/", getUsers);
router.post("/register", register);
router.post("/login", login);

// Protected route example
router.get("/me", authMiddleware, (req, res) => {
  res.json({ message: "Protected user data", userId: req.userId });
});

module.exports = router;
