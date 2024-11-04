const Review = require("../models/Review");
const logger = require("../utils/logger");

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Basic validation for rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const existingReview = await Review.findOne({
      userId: req.user._id,
      productId,
    });
    if (existingReview) {
      logger.warn(
        `User ${req.user._id} attempted to create a duplicate review for product ${productId}`
      );
      return res
        .status(400)
        .json({ error: "You have already reviewed this product" });
    }

    const newReview = new Review({
      userId: req.user._id,
      productId,
      rating,
      comment,
    });

    await newReview.save();
    logger.info(
      `Review created successfully by user ${req.user._id} for product ${productId}`
    );
    res
      .status(201)
      .json({ message: "Review created successfully", review: newReview });
  } catch (error) {
    logger.error(`Failed to create review: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ error: "Failed to create review", details: error.message });
  }
};

// Get all reviews for a product
exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).populate("userId", "name");
    logger.info(`Fetched ${reviews.length} reviews for product ${productId}`);
    res.status(200).json(reviews);
  } catch (error) {
    logger.error(`Failed to fetch reviews: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ error: "Failed to fetch reviews", details: error.message });
  }
};

// Get a single review by its ID
exports.getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId).populate("userId", "name");
    if (!review) {
      logger.warn(`Review with ID ${reviewId} not found`);
      return res.status(404).json({ error: "Review not found" });
    }
    logger.info(`Fetched review with ID ${reviewId}`);
    res.status(200).json(review);
  } catch (error) {
    logger.error(`Failed to fetch review by ID: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ error: "Failed to fetch review", details: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    // Basic validation for rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true }
    ).populate("userId", "name");

    if (!updatedReview) {
      logger.warn(`Review with ID ${reviewId} not found for update`);
      return res.status(404).json({ error: "Review not found" });
    }

    logger.info(`Review with ID ${reviewId} updated successfully`);
    res
      .status(200)
      .json({ message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    logger.error(`Failed to update review: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ error: "Failed to update review", details: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      logger.warn(`Review with ID ${reviewId} not found for deletion`);
      return res.status(404).json({ error: "Review not found" });
    }

    logger.info(`Review with ID ${reviewId} deleted successfully`);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    logger.error(`Failed to delete review: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ error: "Failed to delete review", details: error.message });
  }
};
