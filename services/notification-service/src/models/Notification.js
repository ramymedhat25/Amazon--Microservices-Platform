const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        message: {
            type:String,
            required: true
        },
    type: { type: String, enum: ["low_stock", "order_update", "promotion"], required: true },
    channel: { type: String, enum: ["email", "sms", "in-app"], required: true },
    status: { type: String, enum: ["pending", "sent", "failed"], default: "pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
