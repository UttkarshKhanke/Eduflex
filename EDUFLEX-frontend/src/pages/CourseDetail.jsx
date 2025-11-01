import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiClient";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);
  const [updating, setUpdating] = useState(false);

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // 🔹 Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(res.data);
      } catch (err) {
        console.error("❌ Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, token]);

  // 🔹 Fetch progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get(`/progress/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProgress(res.data);
      } catch (err) {
        console.error("❌ Error fetching progress:", err);
      }
    };
    if (token) fetchProgress();
  }, [id, token]);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // ✅ Toggle module complete/incomplete (instant frontend update)
  const handleToggleModule = async (moduleIndex) => {
    if (progress?.courseCompleted) return; // 🚫 prevent toggling if course completed
    try {
      setUpdating(true);
      await api.put(
        `/progress/${id}/module/${moduleIndex}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Update local state
      setProgress((prev) => {
        const updatedModules = [...prev.moduleProgress];
        updatedModules[moduleIndex] = {
          ...updatedModules[moduleIndex],
          isCompleted: !updatedModules[moduleIndex].isCompleted,
        };

        const allDone = updatedModules.every((m) => m.isCompleted);

        return {
          ...prev,
          moduleProgress: updatedModules,
          courseCompleted: allDone,
        };
      });
    } catch (error) {
      console.error("❌ Error updating module progress:", error);
      alert("Failed to update module progress");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Mark entire course as completed
  const handleCompleteCourse = async () => {
    try {
      setUpdating(true);
      const res = await api.put(
        `/progress/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("🎉 Course marked as completed!");
      setProgress(res.data.progress);
    } catch (error) {
      console.error("❌ Error completing course:", error);
      alert("Failed to mark course as completed.");
    } finally {
      setUpdating(false);
    }
  };

  // 🗑️ Delete course (instructor only)
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

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading course...</p>;
  if (!course)
    return <p className="text-center mt-10 text-gray-600">Course not found.</p>;

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const totalModules = course.modules?.length || 0;
  const allModulesDone =
    progress?.moduleProgress?.length > 0 &&
    progress.moduleProgress.every((m) => m.isCompleted);

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

        {/* ====== Progress Bar ====== */}
        {progress && (
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div
              className="bg-indigo-500 h-4 rounded-full transition-all"
              style={{ width: `${progress.percentage || 0}%` }}
            ></div>
            <p className="text-sm text-gray-600 mt-2 text-right">
              {progress.percentage?.toFixed(0) || 0}% completed
            </p>
          </div>
        )}

        {/* ====== Module List ====== */}
        <div className="space-y-4">
          {Array.isArray(course.modules) && totalModules > 0 ? (
            course.modules.map((mod, index) => {
              const data = mod._doc || mod;
              const moduleTitle = data.name || `Module ${index + 1}`;
              const moduleContent = data.content || "";
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

              const moduleProgress = progress?.moduleProgress || [];
              const isCompleted = moduleProgress[index]?.isCompleted || false;

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
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {moduleContent.trim() !== ""
                          ? moduleContent
                          : "No text content provided for this module."}
                      </p>

                      {imageSrc && (
                        <img
                          src={imageSrc}
                          alt={`Module ${index + 1}`}
                          className="rounded-lg shadow-md max-h-72 w-full object-cover"
                        />
                      )}

                      {videoSrc && (
                        videoSrc.includes("youtube.com") ||
                        videoSrc.includes("youtu.be") ? (
                          <div className="aspect-w-16 aspect-h-9">
                            <iframe
                              className="w-full h-80 rounded-lg shadow-md"
                              src={
                                videoSrc.includes("watch?v=")
                                  ? videoSrc.replace("watch?v=", "embed/")
                                  : videoSrc.replace(
                                      "youtu.be/",
                                      "www.youtube.com/embed/"
                                    )
                              }
                              title={`Module ${index + 1} Video`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        ) : (
                          <video
                            controls
                            className="rounded-lg shadow-md w-full max-h-80"
                            src={videoSrc}
                          />
                        )
                      )}

                      {/* ✅ Completion Toggle */}
                      {!progress?.courseCompleted && (
                        <button
                          onClick={() => handleToggleModule(index)}
                          disabled={updating}
                          className={`mt-4 px-5 py-2 rounded-lg font-medium transition ${
                            isCompleted
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                          }`}
                        >
                          {isCompleted
                            ? "✅ Mark as Incomplete"
                            : "✔️ Mark as Complete"}
                        </button>
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

        {/* ====== Course Completion Button ====== */}
        {!progress?.courseCompleted && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleCompleteCourse}
              disabled={!allModulesDone || updating}
              className={`px-8 py-3 rounded-lg font-semibold transition ${
                allModulesDone
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              🎓 Mark Course as Completed
            </button>
          </div>
        )}

        {/* ====== Completed Banner ====== */}
        {progress?.courseCompleted && (
          <div className="mt-8 text-center bg-green-100 border border-green-300 text-green-800 py-3 rounded-lg font-semibold">
            🎉 Course Completed! Great Job!
          </div>
        )}

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
