const express = require("express");
const {
  getCart,
  addItem,
  updateItem,
  removeItem,
} = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware.js");

const router = express.Router();
router.get("/", authMiddleware, getCart);
router.post("/add", authMiddleware, addItem);
router.put("/update", authMiddleware, updateItem);
router.delete("/remove/:productId", authMiddleware, removeItem);

module.exports = router;