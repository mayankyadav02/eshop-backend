import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  updateStock,
  assignCategory,
  getAdminProducts
} from "../controllers/adminProductController.js";

const router = express.Router();

// Product CRUD (Admin)
router.post("/", protect, admin, createProductAdmin);      // Create product
router.get("/", protect, admin, getAdminProducts);         // Get all products (Admin)
router.put("/:id", protect, admin, updateProductAdmin);    // Update product
router.delete("/:id", protect, admin, deleteProductAdmin); // Delete product

// Stock & Category Management
router.patch("/:id/stock", protect, admin, updateStock);       // Update stock
router.patch("/:id/category", protect, admin, assignCategory); // Assign/remove category

export default router;
