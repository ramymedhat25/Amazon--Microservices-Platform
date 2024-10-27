const Inventory = require("../models/Inventory");

// check stock availability
exports.checkStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const inventoryItem = await Inventory.findOne({ productId });
    if (!inventoryItem || inventoryItem.quantity < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }
    res
      .status(200)
      .json({ message: "Stock available", quantity: inventoryItem.quantity });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error checking stock", details: error.message });
  }
};

// Reduce stock when an order is placed
exports.reduceStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const inventoryItem = await Inventory.findOne({ productId });

    if (!inventoryItem || inventoryItem.quantity < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    inventoryItem.quantity -= quantity;
    await inventoryItem.save();

    // Check if stock is below threshold
    if (inventoryItem.quantity <= inventoryItem.lowStockThreshold) {
      console.log(`Low stock alert for product: ${productId}`);
    }

    res
      .status(200)
      .json({ message: "Stock reduced", quantity: inventoryItem.quantity });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error reducing stock", details: error.message });
  }
};

// Add new product to inventory
exports.addProduct = async (req, res) => {
  try {
    const { productId, quantity, lowStockThreshold } = req.body;
    const inventoryItem = await Inventory.findOne({ productId });

    if (inventoryItem) {
      return res
        .status(400)
        .json({ error: "Product already exists in inventory" });
    }

    const newInventoryItem = new Inventory({
      productId,
      quantity,
      lowStockThreshold,
    });

    await newInventoryItem.save();

    res
      .status(201)
      .json({ message: "Product added to inventory", data: newInventoryItem });
  } catch (error) {
    res.status(500).json({
      error: "Error adding product to inventory",
      details: error.message,
    });
  }
};

// Update product in inventory
exports.updateProduct = async (req, res) => {
  try {
    const { productId, quantity, lowStockThreshold } = req.body;
    const inventoryItem = await Inventory.findOneAndUpdate(
      { productId },
      { quantity, lowStockThreshold },
      { new: true }
    );

    if (!inventoryItem) {
      return res.status(404).json({ error: "Product not found in inventory" });
    }

    res
      .status(200)
      .json({ message: "Product updated in inventory", data: inventoryItem });
  } catch (error) {
    res.status(500).json({
      error: "Error updating product in inventory",
      details: error.message,
    });
  }
};

// Delete product from inventory
exports.deleteProduct = async (req, res) => {
  try {
    const inventoryItem = await Inventory.findByIdAndDelete(req.params.id);

    if (!inventoryItem) {
      return res.status(404).json({ error: "Product not found in inventory" });
    }

    res.status(200).json({ message: "Product deleted from inventory" });
  } catch (error) {
    res.status(500).json({
      error: "Error deleting product from inventory",
      details: error.message,
    });
  }
};

// Get inventory report
exports.getInventoryReport = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find();
    res.status(200).json({ data: inventoryItems });
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving inventory report",
      details: error.message,
    });
  }
};

// Get inventory by product ID
exports.getInventoryByProductId = async (req, res) => {
  try {
    const inventoryItem = await Inventory.findOne({ productId: req.params.id });

    if (!inventoryItem) {
      return res.status(404).json({ error: "Product not found in inventory" });
    }

    res.status(200).json({ data: inventoryItem });
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving inventory by product ID",
      details: error.message,
    });
  }
};

// Get inventory by low stock threshold
exports.getInventoryByLowStockThreshold = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find({
      quantity: { $lte: req.params.threshold },
    });

    res.status(200).json({ data: inventoryItems });
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving inventory by low stock threshold",
      details: error.message,
    });
  }
};

// Get inventory by quantity range
exports.getInventoryByQuantityRange = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find({
      quantity: { $gte: req.params.min, $lte: req.params.max },
    });

    res.status(200).json({ data: inventoryItems });
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving inventory by quantity range",
      details: error.message,
    });
  }
};
