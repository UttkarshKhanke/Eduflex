import express from "express";
import { createQuiz, getQuizById, submitQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createQuiz); // Instructor creates quiz
router.get("/:id", protect, getQuizById); // Get quiz
router.post("/submit", protect, submitQuiz); // Student submits quiz

export default router;
