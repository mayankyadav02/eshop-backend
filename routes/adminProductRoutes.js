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
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Product CRUD (Admin)
// Create product with image
router.post("/", protect, admin, upload.single("image"), createProductAdmin);

// Get all products
router.get("/", protect, admin, getAdminProducts);

// Update product with image
router.put("/:id", protect, admin, upload.single("image"), updateProductAdmin);

// Delete product
router.delete("/:id", protect, admin, deleteProductAdmin);

// Stock & Category Management
router.patch("/:id/stock", protect, admin, updateStock);       // Update stock
router.patch("/:id/category", protect, admin, assignCategory); // Assign/remove category

export default router;
