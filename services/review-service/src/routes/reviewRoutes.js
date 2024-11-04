const express = require("express");
const {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware(["user"]), createReview);
router.get("/product/:productId", getReviews);
router.get("/:reviewId", getReviewById);
router.put("/:reviewId", authMiddleware(["user", "admin"]), updateReview);
router.delete("/:reviewId", authMiddleware(["user", "admin"]), deleteReview);

module.exports = router;
