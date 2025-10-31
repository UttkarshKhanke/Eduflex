// frontend/src/pages/Courses.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";

export default function Courses() {
  const [search, setSearch] = useState("");
  const role = localStorage.getItem("role"); // 'student' or 'instructor'

  const studentCourses = [
    { title: "React Basics", progress: "80%" },
    { title: "Node.js Fundamentals", progress: "65%" },
  ];

  const instructorCourses = [
    { title: "Advanced React Patterns", students: 120 },
    { title: "Full-Stack with MERN", students: 95 },
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4 sm:mb-0">
            {role === "instructor" ? "My Courses 👨‍🏫" : "Enrolled Courses 📚"}
          </h2>

          {/* Search and (optional) Add buttons */}
          <div className="flex items-center gap-4">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition bg-white"
              />
            </div>

            {/* Add button (only for instructor) */}
            {role === "instructor" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
              >
                <Plus size={18} />
                Add Course
              </motion.button>
            )}
          </div>
        </div>

        {/* Course Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(role === "instructor" ? instructorCourses : studentCourses)
            .filter((c) =>
              c.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                  {course.title}
                </h3>

                {role === "student" ? (
                  <p className="text-gray-600 mb-3">
                    Progress:{" "}
                    <span className="font-medium text-gray-800">
                      {course.progress}
                    </span>
                  </p>
                ) : (
                  <p className="text-gray-600 mb-3">
                    Enrolled Students:{" "}
                    <span className="font-medium text-gray-800">
                      {course.students}
                    </span>
                  </p>
                )}

                <button className="w-full py-2 mt-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                  {role === "student" ? "Continue Learning" : "Manage Course"}
                </button>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
