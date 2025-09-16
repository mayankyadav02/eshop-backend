import express from "express";
import {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", authUser);

// User protected routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// Admin only routes
router.get("/", protect, admin, getUsers);          // Get all users
router.delete("/:id", protect, admin, deleteUser);  // Delete user by ID

export default router;
