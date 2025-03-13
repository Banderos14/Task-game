import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskItem from "./TaskItem";

const TaskList = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [xp, setXp] = useState(0);
  const [newTaskText, setNewTaskText] = useState("");
  const [filter, setFilter] = useState("all");

  // ✅ Загружаем задачи и XP при изменении userId
  useEffect(() => {
    if (!userId) {
      console.log("❌ Нет userId, не загружаем задачи.");
      return;
    }

    console.log("🟢 Загружаем задачи для userId:", userId);

    axios.get(`http://localhost:5000/api/tasks/${userId}`)
      .then(response => {
        console.log("📌 Получены задачи:", response.data);
        setTasks(response.data);
      })
      .catch(error => console.error("❌ Ошибка загрузки задач:", error));

    axios.get(`http://localhost:5000/api/auth/me`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }})
      .then(response => {
        console.log("📌 Получен XP:", response.data.xp);
        setXp(response.data.xp);
      })
      .catch(error => console.error("❌ Ошибка загрузки XP:", error));
  }, [userId]);

  // ✅ Фильтрация задач
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true; // "all" - показываем все задачи
  });

  // ✅ Добавление новой задачи (сохранение в БД)
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim() || !userId) return;

    try {
      const response = await axios.post("http://localhost:5000/api/tasks/add", { text: newTaskText, userId });
      setTasks([...tasks, response.data]);
      setNewTaskText("");
    } catch (error) {
      console.error("❌ Ошибка добавления задачи:", error);
    }
  };

  // ✅ Выполнение задачи (и изменение XP)
  const toggleTask = async (taskId) => {
    try {
      const response = await axios.post("http://localhost:5000/api/tasks/toggle", { taskId, userId });
      setTasks(tasks.map(task => (task._id === taskId ? response.data.task : task)));
      setXp(response.data.xp);
    } catch (error) {
      console.error("❌ Ошибка выполнения задачи:", error);
    }
  };

  // ✅ Удаление задачи
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/delete/${taskId}/${userId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("❌ Ошибка удаления задачи:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Список задач</h2>

      {/* ✅ Показываем XP */}
      <div className="mb-4 text-green-600 font-bold">XP: {xp}</div>

      {/* ✅ Форма для добавления новой задачи */}
      <form onSubmit={handleAddTask} className="mb-4">
        <input
          type="text"
          className="p-2 border rounded-lg w-full mb-2"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Добавить новую задачу"
        />
        <button type="submit" className="px-4 py-1 bg-blue-500 text-white rounded-lg">
          Добавить задачу
        </button>
      </form>

      {/* ✅ Фильтры */}
      <div className="mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1 mr-2 rounded-lg ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Все
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-1 mr-2 rounded-lg ${
            filter === "active" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Не выполненные
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-1 rounded-lg ${
            filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Выполненные
        </button>
      </div>

      {/* ✅ Список задач */}
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
          />
        ))
      ) : (
        <p className="text-gray-500">Нет задач в этой категории.</p>
      )}
    </div>
  );
};

export default TaskList;