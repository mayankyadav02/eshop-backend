import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  requestReturn,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// User creates a new order from cart
router.post("/", protect, createOrder);

// Get all orders of logged-in user
router.get("/", protect, getUserOrders);

// Get single order details (user can only see own order)
router.get("/:id", protect, getOrderById);

router.put("/:id/cancel", protect, cancelOrder);

router.put("/:id/return", protect, requestReturn);

export default router;
