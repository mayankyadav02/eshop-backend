// routes/analyticsRoutes.js
import express from "express";
import { getDashboardStats, getSalesByCategory, getMonthlyRevenue } from "../controllers/analyticsController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin-only analytics
router.get("/dashboard", protect, admin, getDashboardStats);
router.get("/sales-by-category", protect, admin, getSalesByCategory);
router.get("/monthly-revenue", protect, admin, getMonthlyRevenue);

export default router;
