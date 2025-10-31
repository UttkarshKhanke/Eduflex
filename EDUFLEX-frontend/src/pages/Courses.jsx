import { useState, useEffect } from "react";
import api from "../api/apiClient";

const demoCourses = [
  { title: "React for Beginners", instructor: "John Doe", lessons: 24 },
  { title: "Node.js Fundamentals", instructor: "Jane Smith", lessons: 18 },
  { title: "MongoDB Mastery", instructor: "Alan Walker", lessons: 15 },
  { title: "Fullstack Web Development", instructor: "Emily Carter", lessons: 32 },
  { title: "Python for Data Science", instructor: "Chris Evans", lessons: 20 },
  { title: "Deep Learning with TensorFlow", instructor: "Sophia Lee", lessons: 28 },
];

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Replace with API later
    // api.get("/courses").then(res => setCourses(res.data)).catch(console.error);
    setCourses(demoCourses);
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Available Courses</h2>
          <p className="text-gray-500 mt-1">
            Explore the latest courses and enhance your learning journey.
          </p>
        </div>

        <button className="mt-4 sm:mt-0 bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300">
          + Add New Course
        </button>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="flex justify-center items-center h-60 text-gray-500">
          No courses available.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course.title}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 relative overflow-hidden group"
            >
              {/* Decorative Gradient Top Bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-blue-500"></div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-600 mt-2">
                  👨‍🏫 <span className="font-medium">{course.instructor}</span>
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  📚 {course.lessons} Lessons
                </p>

                <button className="mt-5 w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-2.5 rounded-lg font-medium hover:opacity-90 hover:scale-[1.02] transition-all duration-300">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
