import Quiz from "../models/quizModel.js";

/**
 * @desc Create a new quiz (instructor only)
 */
export const createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: "Title and questions are required" });
    }

    const quiz = await Quiz.create({
      title,
      description,
      questions,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Error creating quiz", error: error.message });
  }
};

/**
 * @desc Get all quizzes
 */
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("createdBy", "name email");
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quizzes", error: error.message });
  }
};

/**
 * @desc Get a quiz by ID
 */
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quiz", error: error.message });
  }
};

/**
 * @desc Submit quiz attempt (Student)
 */
export const submitQuizAttempt = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body; // array of selected option indexes

    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Check if user already attempted
    const alreadyAttempted = quiz.attempts.some(
      (a) => a.user.toString() === req.user._id.toString()
    );
    if (alreadyAttempted)
      return res.status(400).json({ message: "You have already attempted this quiz." });

    // Calculate score
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });

    // Save attempt
    quiz.attempts.push({
      user: req.user._id,
      score,
      completedAt: new Date(),
    });
    await quiz.save();

    res.json({ message: "Quiz submitted successfully", score, total: quiz.questions.length });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ message: "Error submitting quiz", error: error.message });
  }
};
