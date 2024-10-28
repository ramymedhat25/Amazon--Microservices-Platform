const Cart = require("../models/Cart");

// Get cart for a user
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId }).populate(
      "items.productId"
    );

    if (!cart) {
      cart = { userId: req.userId, items: [] }; // Return an empty cart if none exists
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error); // More detailed error logging
    res
      .status(500)
      .json({ error: "Failed to retrieve cart", details: error.message });
  }
};

// Add item to cart
exports.addItem = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex((item) =>
        item.productId.equals(productId)
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};
// Update item quantity
exports.updateItem = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const itemIndex = cart.items.findIndex((item) =>
      item.productId.equals(productId)
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ error: "Item not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update item in cart" });
  }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
  const { productId } = req.params;
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter((item) => !item.productId.equals(productId));
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};
