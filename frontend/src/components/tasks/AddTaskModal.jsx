import React, { useState } from "react";
import axios from "axios";

const AddTaskModal = ({ isOpen, onClose, onTaskAdded, userId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("low");
  const [reminder, setReminder] = useState("");

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !userId) return;

    try {
      const response = await axios.post("http://localhost:5000/api/tasks/add", {
        text: title,
        description,
        date,
        priority,
        reminder,
        userId,
      });
      onTaskAdded(response.data);
      // Сбрасываем состояние полей формы
      setTitle("");
      setDescription("");
      setDate("");
      setPriority("low");
      setReminder("");
      onClose();
    } catch (error) {
      console.error("❌ Ошибка добавления задачи:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Добавить задачу</h2>
        <form onSubmit={handleAddTask}>
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
            type="datetime-local"
            className="p-2 border rounded-lg w-full mb-2"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
              onClick={onClose}
            >
              Отмена
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Добавить задачу
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;