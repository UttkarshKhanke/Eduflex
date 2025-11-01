// backend/routes/analyticsRoutes.js
import express from "express";
import { getDashboardStats } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Unified route for both student and instructor dashboard analytics
router.get("/stats", protect, getDashboardStats);

export default router;
