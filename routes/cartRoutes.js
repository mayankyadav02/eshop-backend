import express from "express";
import { getCart, addToCart, removeFromCart, clearCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.post("/remove", protect, removeFromCart);
router.post("/clear", protect, clearCart);

export default router;
