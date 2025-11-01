import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import { useNavigate } from "react-router-dom";

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get("/quiz", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuizzes(res.data);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await api.delete(`/quiz/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizzes(quizzes.filter((q) => q._id !== id));
      alert("🗑️ Quiz deleted successfully!");
    } catch (err) {
      alert("Error deleting quiz");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading quizzes...</p>;

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">🧠 All Quizzes</h1>

        {role === "instructor" && (
          <button
            onClick={() => navigate("/quiz/create")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 mb-6"
          >
            ➕ Create New Quiz
          </button>
        )}

        {quizzes.length === 0 ? (
          <p className="text-gray-500">No quizzes available.</p>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold text-indigo-700">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Course: {quiz.course?.title || "N/A"} <br />
                    Created by: {quiz.createdBy?.name} on{" "}
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/quiz/${quiz._id}`)}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    View
                  </button>
                  {role === "instructor" && quiz.createdBy?._id === userId && (
                    <button
                      onClick={() => handleDelete(quiz._id)}
                      className="text-red-600 font-medium hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
