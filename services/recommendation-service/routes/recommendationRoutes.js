const express = require("express");
const {
  generateRecommendations,
  getRecommendations,
} = require("../controllers/recommendationController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Generate recommendations
router.post("/generate", authMiddleware, generateRecommendations);

// Get recommendations for a user
router.get("/", authMiddleware, getRecommendations);

module.exports = router;
