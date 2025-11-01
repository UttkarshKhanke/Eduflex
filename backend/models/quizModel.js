import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: Number, required: true },
    },
  ],
  // Changed createdBy to String to avoid ObjectId casting error
  createdBy: { type: String, required: true },

  attempts: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      score: Number,
      completedAt: Date,
    },
  ],
}, { timestamps: true });

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
export default Quiz;
