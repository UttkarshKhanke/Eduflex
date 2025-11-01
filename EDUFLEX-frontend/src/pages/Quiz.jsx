// frontend/src/pages/Quiz.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Clock, Plus, Search, CheckCircle } from "lucide-react";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";

function Quiz() {
  const [search, setSearch] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizRes = await apiClient.get("/quiz");
        const attemptRes = await apiClient.get("/quiz/attempts/user");
        setQuizzes(quizRes.data);
        setAttempts(attemptRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, []);

  const getAttemptStatus = (quizId) => {
    const attempt = attempts.find((a) => a.quiz._id === quizId);
    return attempt ? attempt : null;
  };

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-50 via-blue-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-800 flex items-center gap-2">
            <Brain className="text-indigo-600" size={36} /> Quizzes
          </h2>

          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition bg-white"
              />
            </div>

            {role === "instructor" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
                onClick={() => navigate("/quiz/create")}
              >
                <Plus size={18} />
                Create Quiz
              </motion.button>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes
            .filter((quiz) =>
              quiz.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((quiz, index) => {
              const attempt = getAttemptStatus(quiz._id);
              return (
                <motion.div
                  key={quiz._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative bg-white/70 backdrop-blur-md border border-transparent hover:border-indigo-200 rounded-2xl shadow-md hover:shadow-2xl transition-all p-6 group"
                >
                  <h3 className="text-xl font-semibold text-indigo-700 mb-3">
                    {quiz.title}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <Clock size={16} />
                    <p>{quiz.questions.length} Questions</p>
                  </div>

                  {attempt ? (
                    <div className="flex flex-col items-center text-green-600">
                      <CheckCircle size={24} />
                      <p className="font-semibold mt-2">
                        Completed ✅
                      </p>
                      <p className="text-sm text-gray-600">
                        Score: {attempt.score} / {attempt.totalMarks}
                      </p>
                    </div>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/quiz/${quiz._id}`)}
                      className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white w-full py-3 rounded-xl font-medium hover:opacity-90 transition"
                    >
                      Start Quiz
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Quiz;
