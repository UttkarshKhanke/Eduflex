import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/apiClient";
import Navbar from "../components/Navbar";

export default function Quiz() {
  // This page supports opening /quizzes/:id
  const { id } = useParams(); // quiz id if route is /quizzes/:id
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!id) return;
    api.get(`/quizzes/${id}`)
      .then((res) => {
        setQuiz(res.data);
        setAnswers(new Array(res.data.questions.length).fill(null));
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleOption = (qIndex, optionIndex) => {
    const copy = [...answers];
    copy[qIndex] = optionIndex;
    setAnswers(copy);
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    try {
      const res = await api.post("/quizzes/submit", { quizId: quiz._id, answers });
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Submit failed");
    }
  };

  if (!id) return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <p>Select a quiz from a course or use the instructor panel to create one.</p>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        {!quiz ? (
          <p>Loading quiz...</p>
        ) : (
          <div className="bg-white p-6 rounded shadow">
            <h1 className="text-xl font-semibold mb-3">{quiz.title}</h1>

            {quiz.questions.map((q, qi) => (
              <div key={qi} className="mb-4">
                <p className="font-medium">{qi + 1}. {q.questionText}</p>
                <div className="mt-2 grid gap-2">
                  {q.options.map((opt, oi) => (
                    <label
                      key={oi}
                      className={`p-2 border rounded cursor-pointer ${
                        answers[qi] === oi ? "bg-blue-50 border-blue-400" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${qi}`}
                        checked={answers[qi] === oi}
                        onChange={() => handleOption(qi, oi)}
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center space-x-3">
              <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
                Submit Quiz
              </button>
            </div>

            {result && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p>Score: {result.score} / {result.totalQuestions}</p>
                <p>Percentage: {result.percentage}%</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
