import Quiz from "../models/Quiz.js";
import Progress from "../models/Progress.js";

// Instructor creates a quiz
export const createQuiz = async (req, res) => {
  try {
    const { course, title, questions } = req.body;
    const instructor = req.user.id;

    const quiz = new Quiz({ course, instructor, title, questions });
    await quiz.save();

    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get quiz by ID
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("course", "title");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Student submits quiz
export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });

    const percentage = ((score / quiz.questions.length) * 100).toFixed(2);

    // Save progress
    const progress = new Progress({
      student: req.user.id,
      course: quiz.course,
      quiz: quiz._id,
      score,
      totalQuestions: quiz.questions.length,
      percentage,
    });
    await progress.save();

    res.status(200).json({
      message: "Quiz submitted successfully",
      score,
      totalQuestions: quiz.questions.length,
      percentage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
