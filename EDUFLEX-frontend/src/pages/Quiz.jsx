import { motion } from "framer-motion";
import { Brain, Clock } from "lucide-react";

const quizzes = [
  { title: "React Basics Quiz", questions: 10 },
  { title: "Node.js Quiz", questions: 8 },
  { title: "MongoDB Quiz", questions: 12 },
  { title: "Express Fundamentals", questions: 9 },
  { title: "Frontend Design Quiz", questions: 7 },
  { title: "JavaScript Advanced", questions: 15 },
];

function Quiz() {
  return (
    <div className="p-8 bg-gradient-to-br from-indigo-50 via-blue-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-4xl font-extrabold mb-3 text-gray-800 flex justify-center items-center gap-2">
          <Brain className="text-indigo-600" size={36} /> Interactive Quizzes
        </h2>
        <p className="text-gray-600 mb-10 text-lg">
          Sharpen your skills with topic-wise quizzes and real-time feedback ⚡
        </p>

        {/* Quiz Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="relative bg-white/70 backdrop-blur-md border border-transparent hover:border-indigo-200 rounded-2xl shadow-md hover:shadow-2xl transition-all p-6 group"
            >
              {/* Gradient border glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-500 opacity-0 group-hover:opacity-10 blur-xl transition-all rounded-2xl"></div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">
                {quiz.title}
              </h3>

              <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                <Clock size={16} />
                <p>
                  {quiz.questions} Questions •{" "}
                  <span className="font-medium text-gray-700">
                    {quiz.questions < 9
                      ? "Easy"
                      : quiz.questions < 12
                      ? "Medium"
                      : "Hard"}
                  </span>
                </p>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white w-full py-3 rounded-xl font-medium hover:opacity-90 transition"
              >
                Start Quiz
              </motion.button>

              <div className="absolute top-4 right-4 text-yellow-400 cursor-pointer text-xl hover:scale-125 transition-transform">
                ⭐
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Quiz;
