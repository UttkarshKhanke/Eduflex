import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiClient";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📦 Course data:", res.data);
        console.log("🧩 Modules data:", res.data.modules);
        setCourse(res.data);
      } catch (err) {
        console.error("❌ Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, token]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Course deleted successfully!");
      navigate("/courses");
    } catch (error) {
      console.error("❌ Error deleting course:", error);
      alert("Error deleting course.");
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading course...</p>;
  if (!course)
    return <p className="text-center mt-10 text-gray-600">Course not found.</p>;

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-50 via-blue-50 to-white min-h-screen">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-indigo-100">
        {/* ====== Course Title ====== */}
        <h2 className="text-3xl font-bold text-indigo-700 mb-3">{course.title}</h2>
        <p className="text-gray-700 mb-6">{course.description}</p>

        {/* ====== Created Info ====== */}
        <div className="text-sm text-gray-500 mb-8">
          <p>
            👤 Created by:{" "}
            <span className="font-medium text-gray-700">
              {course.createdBy?.name || "Unknown"}
            </span>
          </p>
          <p>🕓 Created on: {new Date(course.createdAt).toLocaleDateString()}</p>
        </div>

        {/* ====== Module List ====== */}
        <div className="space-y-4">
          {Array.isArray(course.modules) && course.modules.length > 0 ? (
            course.modules.map((mod, index) => {
              const data = mod._doc || mod;

              const moduleTitle =
                data.name ||
                data.moduleName ||
                data.title ||
                `Module ${index + 1}`;

              const moduleContent =
                data.content ||
                data.text ||
                data.description ||
                data.moduleContent ||
                "";

              // ✅ Handle all possible image/video formats (binary or URL)
              const imageSrc = data.image?.url
                ? data.image.url
                : data.image?.data
                ? `${apiBase}/api/courses/${course._id}/media/image/${index}`
                : null;

              const videoSrc = data.video?.url
                ? data.video.url
                : data.video?.data
                ? `${apiBase}/api/courses/${course._id}/media/video/${index}`
                : null;

              return (
                <div
                  key={index}
                  className="border border-gray-300 rounded-xl overflow-hidden bg-gray-50/60 shadow-sm"
                >
                  {/* Header */}
                  <div
                    onClick={() => toggleExpand(index)}
                    className="cursor-pointer bg-indigo-100 hover:bg-indigo-200 transition p-4 flex justify-between items-center"
                  >
                    <h3 className="text-lg font-semibold text-indigo-700">
                      {moduleTitle}
                    </h3>
                    <span className="text-gray-600">
                      {expandedIndex === index ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* Expanded Content */}
                  {expandedIndex === index && (
                    <div className="p-5 bg-white space-y-4 border-t">
                      {/* Text Content */}
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {moduleContent.trim() !== ""
                          ? moduleContent
                          : "No text content provided for this module."}
                      </p>

                      {/* Image */}
                      {imageSrc && (
                        <img
                          src={imageSrc}
                          alt={`Module ${index + 1}`}
                          className="rounded-lg shadow-md max-h-72 w-full object-cover"
                        />
                      )}

                      {/* Video */}
                      {/* Video Section */}
                        {videoSrc && (
                          videoSrc.includes("youtube.com") || videoSrc.includes("youtu.be") ? (
                            // 🎥 YouTube video embed
                            <div className="aspect-w-16 aspect-h-9">
                              <iframe
                                className="w-full h-80 rounded-lg shadow-md"
                                src={
                                  videoSrc.includes("watch?v=")
                                    ? videoSrc.replace("watch?v=", "embed/")
                                    : videoSrc.replace("youtu.be/", "www.youtube.com/embed/")
                                }
                                title={`Module ${index + 1} Video`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          ) : (
                            // 🎬 Uploaded or direct video file
                            <video
                              controls
                              className="rounded-lg shadow-md w-full max-h-80"
                              src={videoSrc}
                            />
                          )
                        )}

                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">No modules available.</p>
          )}
        </div>

        {/* ====== Delete Button ====== */}
        {role === "instructor" && course.createdBy?._id === userId && (
          <div className="flex justify-end mt-10">
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              🗑️ Delete Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
