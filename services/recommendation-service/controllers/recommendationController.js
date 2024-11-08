const Recommendation = require("../models/Recommendation");
const axios = require("axios");
const logger = require("../utils/logger");

// Generate recommendations based on user's purchase history
exports.generateRecommendations = async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch user purchase history from Order Service
    const { data: orders } = await axios.get(
      `${process.env.ORDER_SERVICE_URL}/user/${userId}`
    );

    // Extract product IDs from orders
    const purchasedProductIds = orders.flatMap((order) =>
      order.products.map((product) => product.productId)
    );

    // Fetch product details from Product Service
    const { data: products } = await axios.post(
      `${process.env.PRODUCT_SERVICE_URL}/details`,
      {
        productIds: purchasedProductIds,
      }
    );

    // Generate recommendations
    const recommendations = products.map((product) => ({
      productId: product._id,
      reason: `Based on your interest in ${product.name}`,
    }));

    // Save recommendations to DB
    let userRecommendations = await Recommendation.findOne({ userId });
    if (!userRecommendations) {
      userRecommendations = new Recommendation({ userId, recommendations });
    } else {
      userRecommendations.recommendations = recommendations;
    }

    await userRecommendations.save();

    res.status(200).json(userRecommendations);
  } catch (error) {
    logger.error("Failed to generate recommendations", {
      error: error.message,
    });
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
};

// Get recommendations for a user
exports.getRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.findOne({
      userId: req.userId,
    }).populate("recommendations.productId");

    if (!recommendations) {
      return res.status(404).json({ error: "No recommendations found" });
    }

    res.status(200).json(recommendations);
  } catch (error) {
    logger.error("Failed to retrieve recommendations", {
      error: error.message,
    });
    res.status(500).json({ error: "Failed to retrieve recommendations" });
  }
};
