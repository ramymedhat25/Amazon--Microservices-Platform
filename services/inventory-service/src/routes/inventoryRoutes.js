const express = require("express");
const {
  checkStock,
  reduceStock,
  addProduct,
  updateProduct,
  deleteProduct,
  getInventoryReport,
  getInventoryByProductId,
  getInventoryByLowStockThreshold,
  getInventoryByQuantityRange,
} = require("../controllers/inventoryController");

const router = express.Router();

router.post("/check", checkStock); // Check stock availability
router.post("/reduce", reduceStock); // Reduce stock when an order is placed
router.post("/add", addProduct); // Add new product to inventory
router.put("/update", updateProduct); // Update product in inventory
router.delete("/delete/:id", deleteProduct); // Delete product from inventory
router.get("/report", getInventoryReport); // Get full inventory report
router.get("/product/:id", getInventoryByProductId); // Get inventory by product ID
router.get("/low-stock/:threshold", getInventoryByLowStockThreshold); // Get products below stock threshold
router.get("/quantity-range/:min/:max", getInventoryByQuantityRange); // Get products by quantity range

module.exports = router;
