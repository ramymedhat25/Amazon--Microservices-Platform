const express = require("express");
const {
  createOrder,
  getOrdersByUser,
  updateOrderStatus,
} = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Protected routes
router.post("/", authMiddleware, createOrder);
router.get("/user", authMiddleware, getOrdersByUser);
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["admin"]),
  updateOrderStatus
);

module.exports = router;
