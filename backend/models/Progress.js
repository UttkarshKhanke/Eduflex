// models/Progress.js
import mongoose from "mongoose";

const moduleProgressSchema = new mongoose.Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, required: true },
  isCompleted: { type: Boolean, default: false },
});

const progressSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },

    // Quiz / Lesson tracking
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    completedLessons: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },

    // 🧩 Per-module progress
    moduleProgress: [moduleProgressSchema],

    // ✅ Course completion flag
    courseCompleted: { type: Boolean, default: false },

    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 🧠 Auto-calculate progress before save
progressSchema.pre("save", function (next) {
  if (this.totalLessons > 0) {
    this.percentage = Math.min((this.completedLessons / this.totalLessons) * 100, 100);
  }

  const allModulesCompleted =
    this.moduleProgress.length > 0 && this.moduleProgress.every((m) => m.isCompleted);

  if (allModulesCompleted && !this.courseCompleted) {
    this.courseCompleted = true;
  }

  this.lastUpdated = Date.now();
  next();
});

// ✅ Fix: prevent OverwriteModelError
export default mongoose.models.Progress || mongoose.model("Progress", progressSchema);
