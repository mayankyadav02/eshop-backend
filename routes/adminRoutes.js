import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getUserById,
  blockUnblockUser,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getStats,
  getDashboardSummary,
} from "../controllers/adminController.js";
import { approveReturn, deliverOrder } from "../controllers/orderController.js";

const router = express.Router();

// User Management
router.get("/users", protect, admin, getAllUsers);           // Get all users
router.get("/users/:id", protect, admin, getUserById);       // Get single user
router.put("/users/:id/block", protect, admin, blockUnblockUser); // Block/Unblock user

// Order Management
router.get("/orders", protect, admin, getAllOrders);         // Get all orders
router.get("/orders/:id", protect, admin, getOrderById);    // Get single order
router.put("/orders/:id/status", protect, admin, updateOrderStatus); // Update order status

// Dashboard Stats
router.get("/stats", protect, admin, getStats);             // General stats
router.get("/summary", protect, admin, getDashboardSummary); // Summary (users, orders, revenue)

router.put("/orders/:id/deliver", protect, admin, deliverOrder);

router.put("/orders/:id/approve-return", protect, admin, approveReturn);



export default router;
