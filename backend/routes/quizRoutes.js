// backend/routes/quizRoutes.js
import express from "express";
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  submitQuizAttempt,
} from "../controllers/quizController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create quiz (Instructor only)
router.post("/", verifyToken, authorizeRoles("instructor"), createQuiz);

// ✅ Get all quizzes (for students)
router.get("/", verifyToken, getAllQuizzes);

// ✅ Get single quiz by ID
router.get("/:id", verifyToken, getQuizById);

// ✅ Submit quiz attempt (Student only)
router.post("/:id/attempt", verifyToken, authorizeRoles("student"), submitQuizAttempt);

export default router;
