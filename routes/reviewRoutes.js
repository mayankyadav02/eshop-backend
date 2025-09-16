import express from "express";
import { createReview, getAllReviews, getProductReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all reviews (optional)
router.get("/", getAllReviews);


// Create / Update review
router.post("/", protect, createReview);

// Get reviews for a product
router.get("/:productId", getProductReviews);

export default router;
