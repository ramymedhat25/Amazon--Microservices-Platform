const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    quantity: { type: Number, required: true },
    lowStockThreshold: { type: Number, default: 5 }, // Optional, for restock notifications
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
