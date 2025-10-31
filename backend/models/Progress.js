import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  completedLessons: { type: Number, default: 0 },
  totalLessons: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model("Progress", progressSchema);
