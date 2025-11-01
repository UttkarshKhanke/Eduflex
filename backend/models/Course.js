import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  name: { type: String, default: "Untitled Module" },
  content: { type: String, default: "" },
  image: {
    data: Buffer,
    contentType: String,
    url: String, // for external URLs (YouTube/image)
  },
  video: {
    data: Buffer,
    contentType: String,
    url: String, // for external URLs
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    modules: [moduleSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
