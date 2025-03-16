import React, { useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const TaskItem = ({ task, toggleTask, deleteTask, onUpdateTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.text);
  const [description, setDescription] = useState(task.description || "");
  const [date, setDate] = useState(task.date ? new Date(task.date).toISOString().split('T')[0] : "");
  const [priority, setPriority] = useState(task.priority || "low");
  const [reminder, setReminder] = useState(task.reminder ? new Date(task.reminder).toISOString().slice(11, 16) : "");

  const handleUpdateTask = async () => {
    try {
      const updatedTask = {
        ...task,
        text: title,
        description,
        date,
        priority,
        reminder: reminder ? new Date(`${date}T${reminder}`) : null,
      };
      await axios.put(`http://localhost:5000/api/tasks/update/${task._id}`, updatedTask);
      onUpdateTask(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Ошибка обновления задачи:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-600";
      case "medium":
        return "bg-orange-500";
      case "low":
      default:
        return "bg-blue-500";
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className={`p-2 mb-2 border rounded-lg ${task.completed ? "bg-green-200" : "bg-gray-100"}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">{formatTime(task.date)}</span>
          <span className={`text-lg ${task.completed ? "line-through" : ""}`}>
            {task.text}
          </span>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => toggleTask(task._id)}
            className={`w-6 h-6 rounded-full ${getPriorityColor(task.priority)} mr-2`}
          ></button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-2 py-1 bg-yellow-500 text-white rounded-lg mr-2 flex items-center"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => deleteTask(task._id)}
            className="px-2 py-1 bg-red-500 text-white rounded-lg flex items-center"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      {isEditing && (
        <div className="mt-2">
          <input
            type="text"
            className="p-2 border rounded-lg w-full mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название задачи"
          />
          <textarea
            className="p-2 border rounded-lg w-full mb-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание задачи"
          />
          <input
            type="date"
            className="p-2 border rounded-lg w-full mb-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <select
            className="p-2 border rounded-lg w-full mb-2"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Низкий приоритет</option>
            <option value="medium">Средний приоритет</option>
            <option value="high">Высокий приоритет</option>
          </select>
          <input
            type="time"
            className="p-2 border rounded-lg w-full mb-2"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
          />
          <button
            onClick={handleUpdateTask}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskItem;