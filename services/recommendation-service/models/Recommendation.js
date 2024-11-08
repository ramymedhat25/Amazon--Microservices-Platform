const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    recommendations: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        reason: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recommendation", recommendationSchema);
