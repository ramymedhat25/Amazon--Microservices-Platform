const express = require("express");
const { 
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
 } = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected routes - only authenticated users with admin role
router.post("/", authMiddleware, roleMiddleware(["admin"]), createProduct);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updateProduct);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteProduct);

module.exports = router;