// models/course.js
import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },

  image: {
    data: Buffer,
    contentType: String,
    filename: String,
    url: String,
  },

  video: {
    data: Buffer,
    contentType: String,
    filename: String,
    url: String,
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    modules: [moduleSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
export default mongoose.models.Course || mongoose.model("Course", courseSchema);
