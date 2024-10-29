const express = require("express");
const { processPayment, handleWebhook } = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/pay", authMiddleware, processPayment);
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

module.exports = router;
