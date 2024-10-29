const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    orderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Order" },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    amount: { type: Number, required: true, min: 0 },
    paymentProviderId: { type: String }, // ID from Stripe, etc.
}, { timestamps: true });
module.exports = mongoose.model("Payment", paymentSchema);
