import { useEffect, useState } from "react";
import api from "../api/apiClient";
import Navbar from "../components/Navbar";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (courseId) => {
    // Minimal: In Phase 3 we didn't implement enroll API.
    // For now show an alert; later you can POST /enrollments (create enrollment model).
    alert("Enroll feature not implemented yet — will add in next phase.");
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Available Courses</h1>

        {loading ? (
          <p>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p>No courses available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((c) => (
              <div key={c._id} className="bg-white p-4 rounded shadow">
                <h2 className="font-semibold text-lg">{c.title}</h2>
                <p className="text-sm text-gray-600 mt-2">{c.description}</p>
                <p className="mt-3 font-medium">Instructor: {c.instructor?.name || "—"}</p>
                <div className="mt-3 flex items-center space-x-3">
                  <button
                    onClick={() => handleEnroll(c._id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Enroll
                  </button>
                  <a
                    href={`/courses/${c._id}`}
                    className="text-sm text-blue-600 underline"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
