// src/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },  // Number of items in stock
    imageUrl: { type: String },           // URL for the product image
  },
  { timestamps: true }                    // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model("Product", productSchema);
