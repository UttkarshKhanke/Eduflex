import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, Edit2, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/apiClient";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId"); // ✅ store userId in localStorage at login
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const fetchedCourses = Array.isArray(res.data)
          ? res.data
          : res.data.courses || [];

        setCourses(fetchedCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses([]);
      }
    };

    fetchCourses();
  }, []);

  // ✅ Delete Course
  const handleDelete = async (courseId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      alert("✅ Course deleted successfully!");
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("❌ Failed to delete course.");
    }
  };

  // ✅ Filtered list
  const filteredCourses = Array.isArray(courses)
    ? courses.filter((course) =>
        course.title?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-50 via-blue-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-4xl font-extrabold mb-3 text-gray-800 flex justify-center items-center gap-2">
          <BookOpen className="text-indigo-600" size={36} /> Courses
        </h2>
        <p className="text-gray-600 mb-10 text-lg">
          Browse, learn, and grow with structured modules 🌱
        </p>

        {/* Search + Add */}
        <div className="flex justify-center items-center gap-4 mb-10">
          <div className="relative w-72">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {role === "instructor" && (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Link
                to="/create-course"
                className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition inline-block"
              >
                + Add Course
              </Link>
            </motion.div>
          )}
        </div>

        {/* Courses Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="relative bg-white/70 backdrop-blur-md border border-transparent hover:border-indigo-200 rounded-2xl shadow-md hover:shadow-2xl transition-all p-6 group cursor-pointer"
              >
                <Link to={`/courses/${course._id}`}>
                  <h3 className="text-xl font-semibold text-indigo-700 mb-3">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Created by: {course.createdBy?.name || "Unknown"}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
              Modules: {course.modules?.length || 0}
            </p>

            {role === "instructor" && (
                <div className="flex justify-end mt-2">
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      if (!window.confirm("Are you sure you want to delete this course?")) return;
                      try {
                        await api.delete(`/courses/${course._id}`, {
                          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                        });
                        setCourses((prev) => prev.filter((c) => c._id !== course._id));
                        alert("🗑️ Course deleted successfully");
                      } catch (err) {
                        console.error("Error deleting course:", err);
                        alert("❌ Failed to delete course");
                      }
                    }}
                    className="text-red-600 hover:text-red-800 font-medium transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
                </Link>

                {/* Instructor Controls */}
                {role === "instructor" && course.createdBy?._id === userId && (
                  <div className="flex justify-end gap-3 mt-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate(`/edit-course/${course._id}`)}
                      className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500"
                    >
                      <Edit2 size={16} /> Edit
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(course._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Trash2 size={16} /> Delete
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 text-lg col-span-full">
              No courses found. {role === "instructor" && "Create one now!"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Courses;
