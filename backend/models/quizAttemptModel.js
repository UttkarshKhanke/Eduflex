import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [
      {
        questionIndex: { type: Number, required: true },
        selectedOptions: [{ type: Number, required: true }], // store selected indexes
      },
    ],
    score: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    attemptedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent duplicate attempts (one attempt per quiz per student)
quizAttemptSchema.index({ quiz: 1, student: 1 }, { unique: true });

// ✅ Proper default export to prevent “does not provide an export named 'default'” error
const QuizAttempt =
  mongoose.models.QuizAttempt ||
  mongoose.model("QuizAttempt", quizAttemptSchema);

export default QuizAttempt;
