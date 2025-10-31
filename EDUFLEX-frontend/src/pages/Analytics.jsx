import { useEffect, useState } from "react";
import api from "../api/apiClient";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/analytics/instructor")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) return <p className="text-center mt-10">Loading analytics...</p>;

  const chartData = [
    { name: "Courses", value: data.totalCourses },
    { name: "Students", value: data.totalStudents },
    { name: "Quizzes", value: data.totalQuizzes },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Instructor Analytics</h1>
      <p>Average Performance: {data.avgPerformance}%</p>

      <div className="mt-8">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
