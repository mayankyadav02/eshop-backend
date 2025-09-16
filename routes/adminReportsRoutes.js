// routes/adminReportsRoutes.js
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  salesByCategory,
  orderStatusCounts,
  topProducts,
} from "../controllers/adminReportsController.js";

const router = express.Router();

// Reports & Analytics (Admin only)
router.get("/sales-by-category", protect, admin, salesByCategory);
router.get("/order-status-counts", protect, admin, orderStatusCounts);
router.get("/top-products", protect, admin, topProducts);

export default router;
