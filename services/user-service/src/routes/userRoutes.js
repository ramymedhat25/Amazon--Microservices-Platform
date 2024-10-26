const express = require("express");
const { register, login } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Protected route example
router.get("/me", authMiddleware, (req, res) => {
  res.json({ message: "Protected user data", userId: req.userId });
});

module.exports = router;
