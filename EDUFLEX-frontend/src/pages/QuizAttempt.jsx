// frontend/src/pages/QuizAttempt.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/apiClient";
import { motion } from "framer-motion";

function QuizAttempt() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // ✅ Fetch quiz details
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await apiClient.get(`/quiz/${id}`);
        setQuiz(res.data);
      } catch (err) {
        console.error("Error loading quiz:", err);
        alert("Failed to load quiz!");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading quiz...
      </div>
    );

  if (!quiz)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Quiz not found!
      </div>
    );

  // ✅ Handle answer selection
  const handleAnswer = (qIndex, optionIndex) => {
    if (quiz.questions[qIndex].type === "mcq") {
      setAnswers({ ...answers, [qIndex]: [optionIndex] });
    } else {
      const current = answers[qIndex] || [];
      if (current.includes(optionIndex)) {
        setAnswers({
          ...answers,
          [qIndex]: current.filter((o) => o !== optionIndex),
        });
      } else {
        setAnswers({
          ...answers,
          [qIndex]: [...current, optionIndex],
        });
      }
    }
  };

  // ✅ Submit quiz
  const handleSubmit = async () => {
  try {
    const res = await apiClient.post(`/quiz/${id}/attempt`, { answers });
    setScore(res.data.score);
    setSubmitted(true);
  } catch (error) {
    if (error.response?.data?.message === "You have already attempted this quiz.") {
      alert("⚠️ You already completed this quiz.");
      navigate("/quiz");
    } else {
      console.error("Submit error:", error);
      alert("Error submitting quiz.");
    }
  }
};


  if (submitted)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-green-50 to-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-lg text-center"
        >
          <h2 className="text-3xl font-bold text-green-700 mb-4">
            🎉 Quiz Submitted!
          </h2>
          <p className="text-xl text-gray-700">
            You scored{" "}
            <span className="text-indigo-600 font-semibold">{score}</span> out
            of{" "}
            <span className="font-semibold text-gray-800">
              {quiz.questions.reduce((a, b) => a + b.marks, 0)}
            </span>
          </p>
        </motion.div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 mb-10 bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        🧩 {quiz.title}
      </h2>

      {quiz.questions.map((q, qIndex) => (
        <motion.div
          key={qIndex}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-5 border rounded-xl bg-gray-50"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {qIndex + 1}. {q.question}
          </h3>

          {q.image && (
            <img
              src={q.image}
              alt="Question"
              className="w-60 h-40 object-cover rounded-lg mb-3 border"
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((opt, oIndex) => (
              <label
                key={oIndex}
                className={`flex items-center gap-2 border p-2 rounded-lg cursor-pointer transition ${
                  (answers[qIndex] || []).includes(oIndex)
                    ? "bg-indigo-100 border-indigo-400"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <input
                  type={q.type === "mcq" ? "radio" : "checkbox"}
                  name={`q-${qIndex}`}
                  checked={(answers[qIndex] || []).includes(oIndex)}
                  onChange={() => handleAnswer(qIndex, oIndex)}
                />
                {opt}
              </label>
            ))}
          </div>
        </motion.div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition w-full font-semibold"
      >
        Submit Quiz
      </button>
    </div>
  );
}

export default QuizAttempt;
