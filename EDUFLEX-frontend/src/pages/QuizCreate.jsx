import React, { useState } from "react";
import axios from "axios";

const QuizCreate = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);

  const [loading, setLoading] = useState(false);

  // ✅ Change this: createdBy will come from logged-in user (token)
  const token = localStorage.getItem("token"); // assumes token is saved after login

  // -------------------------
  // Handlers
  // -------------------------
  const handleQuestionChange = (i, field, value) => {
    const updated = [...questions];
    updated[i][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (i, j, value) => {
    const updated = [...questions];
    updated[i].options[j] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  };

  // -------------------------
  // Submit handler
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("⚠️ You must be logged in as an instructor to create a quiz.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/quiz/create",
        {
          title,
          description,
          questions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      alert("✅ Quiz created successfully!");
      console.log("Quiz created:", res.data);

      // Reset form
      setTitle("");
      setDescription("");
      setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
    } catch (err) {
      console.error("❌ Error creating quiz:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>🧩 Create New Quiz</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <h3>📝 Questions</h3>
        {questions.map((q, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          >
            <input
              type="text"
              placeholder={`Question ${i + 1}`}
              value={q.question}
              onChange={(e) =>
                handleQuestionChange(i, "question", e.target.value)
              }
              required
              style={{ width: "100%", marginBottom: "8px", padding: "8px" }}
            />

            {q.options.map((opt, j) => (
              <input
                key={j}
                type="text"
                placeholder={`Option ${j + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(i, j, e.target.value)}
                required
                style={{ width: "100%", marginBottom: "6px", padding: "8px" }}
              />
            ))}

            <label style={{ display: "block", marginTop: "5px" }}>
              ✅ Correct Answer (index 0–3):
              <input
                type="number"
                min="0"
                max="3"
                value={q.correctAnswer}
                onChange={(e) =>
                  handleQuestionChange(i, "correctAnswer", +e.target.value)
                }
                style={{ marginLeft: "10px", padding: "5px", width: "60px" }}
              />
            </label>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          style={{
            marginRight: "10px",
            backgroundColor: "#007bff",
            color: "white",
            padding: "8px 14px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ➕ Add Question
        </button>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? "gray" : "#28a745",
            color: "white",
            padding: "8px 14px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {loading ? "Creating..." : "🚀 Create Quiz"}
        </button>
      </form>
    </div>
  );
};

export default QuizCreate;
