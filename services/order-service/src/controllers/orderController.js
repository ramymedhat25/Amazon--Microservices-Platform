const Order = require("../models/Order");
const axios = require("axios");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const order = new Order({
      userId: req.userId,
      items,
      totalAmount,
    });
    await order.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating order", details: error.message });
  }
};

// Get orders by user
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId });
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching orders", details: error.message });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating order", details: error.message });
  }
};

// Get order details (admin only)

exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching order details", details: error.message });
  }
};

const checkStock = async (productId, quantity) => {
  const response = await axios.post(
    "http://localhost:8003/api/inventory/check",
    {
      productId,
      quantity,
    }
  );
  return response.data;
};
