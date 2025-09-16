// controllers/reviewController.js
import Review from "../models/Review.js";
import Product from "../models/Product.js";

// @desc    Create or Update review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();
    } else {
      // Create new review
      const review = new Review({
        user: req.user._id,
        product: productId,
        rating,
        comment,
      });
      await review.save();
    }

    // Recalculate average rating
    const reviews = await Review.find({ product: productId });
    product.rating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await product.save();

    res.json({ message: "Review submitted successfully" });
  } catch (err) {
    console.error("createReview error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().limit(100);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get reviews of a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name email");

    res.json(reviews);
  } catch (err) {
    console.error("getProductReviews error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export { createReview, getProductReviews };
