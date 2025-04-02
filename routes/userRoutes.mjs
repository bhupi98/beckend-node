import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} from "../controllers/userController.mjs";
import authMiddleware from "../middleware/authMiddleware.mjs";
import roleMiddleware from "../middleware/roleMiddleware.mjs";

const router = express.Router();

// Protected Routes
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

// Admin Route - Only accessible to admins
router.get("/", authMiddleware, roleMiddleware(["admin"]), getAllUsers);

export default router;
