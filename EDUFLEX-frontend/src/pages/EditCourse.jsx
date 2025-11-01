import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiClient";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const course = res.data;
        setTitle(course.title);
        setDescription(course.description);
        setModules(course.modules || []);
      } catch (err) {
        console.error("Error fetching course:", err);
      }
    };
    fetchCourse();
  }, [id]);

  const handleModuleChange = (index, field, value) => {
    const updated = [...modules];
    updated[index][field] = value;
    setModules(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/courses/${id}`,
        { title, description, modules },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("✅ Course updated successfully!");
      navigate("/courses");
    } catch (err) {
      console.error("Error updating course:", err);
      alert("❌ Failed to update course.");
    }
  };

  return (
    <div className="p-10 bg-gradient-to-br from-indigo-50 to-white min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">Edit Course</h2>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Modules</h3>
            {modules.map((mod, index) => (
              <div
                key={index}
                className="bg-gray-50 p-3 mb-3 rounded-lg border border-gray-200"
              >
                <input
                  type="text"
                  value={mod.name}
                  onChange={(e) =>
                    handleModuleChange(index, "name", e.target.value)
                  }
                  placeholder="Module name"
                  className="w-full p-2 border rounded-lg mb-2 focus:ring-2 focus:ring-indigo-400"
                />
                <textarea
                  value={mod.content}
                  onChange={(e) =>
                    handleModuleChange(index, "content", e.target.value)
                  }
                  placeholder="Module content"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditCourse;
