import express from "express";
import { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getWishlist);
router.post("/add", protect, addToWishlist);
router.post("/remove", protect, removeFromWishlist);
router.post("/clear", protect, clearWishlist);

export default router;
