import React, { useState } from "react";
import api from "../api/apiClient";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const navigate = useNavigate(); // ✅ Must be inside component

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [modules, setModules] = useState([
    { name: "", content: "", image: "", video: "", imageFile: null, videoFile: null },
  ]);

  const addModule = () => {
    setModules([...modules, { name: "", content: "", image: "", video: "", imageFile: null, videoFile: null }]);
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      // Prepare modules JSON (excluding files)
      const modulesData = modules.map((mod) => ({
        name: mod.name,
        content: mod.content,
        image: mod.image || "",
        video: mod.video || "",
      }));

      formData.append("modules", JSON.stringify(modulesData));

      // Append files separately
      modules.forEach((mod) => {
        if (mod.imageFile) formData.append("image", mod.imageFile);
        if (mod.videoFile) formData.append("video", mod.videoFile);
      });

      const { data } = await api.post("/courses/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });

      console.log("✅ Created Course:", data);

      // ✅ Redirect to courses page after successful creation
      navigate("/courses");

      // Reset form
      setTitle("");
      setDescription("");
      setModules([{ name: "", content: "", image: "", video: "", imageFile: null, videoFile: null }]);
    } catch (error) {
      console.error("❌ Error creating course:", error);
      alert("❌ Failed to create course. Check console for details.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Create New Course</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          rows={3}
        />

        <h2 className="text-lg font-semibold mb-3">Modules</h2>
        {modules.map((mod, index) => (
          <div key={index} className="border p-4 mb-4 rounded-lg bg-gray-50">
            <input
              type="text"
              placeholder="Module Name"
              value={mod.name}
              onChange={(e) => handleModuleChange(index, "name", e.target.value)}
              className="w-full border p-2 mb-2 rounded"
            />

            <textarea
              placeholder="Module Content / Notes"
              value={mod.content}
              onChange={(e) => handleModuleChange(index, "content", e.target.value)}
              className="w-full border p-2 mb-2 rounded"
              rows={3}
            />

            <input
              type="text"
              placeholder="Image URL (optional)"
              value={mod.image}
              onChange={(e) => handleModuleChange(index, "image", e.target.value)}
              className="w-full border p-2 mb-2 rounded"
            />

            <input
              type="text"
              placeholder="Video URL (optional)"
              value={mod.video}
              onChange={(e) => handleModuleChange(index, "video", e.target.value)}
              className="w-full border p-2 mb-2 rounded"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleModuleChange(index, "imageFile", e.target.files[0])
              }
              className="w-full border p-2 mb-2 rounded bg-white"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Video (optional)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                handleModuleChange(index, "videoFile", e.target.files[0])
              }
              className="w-full border p-2 mb-2 rounded bg-white"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addModule}
          className="bg-gray-700 text-white px-3 py-2 rounded-md mb-4"
        >
          + Add Module
        </button>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-bold"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
