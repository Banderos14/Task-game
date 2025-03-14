import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskItem from "./TaskItem";
import ProgressBar from "../progress/ProgressBar";

const TaskList = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [xp, setXp] = useState(0);
  const [newTaskText, setNewTaskText] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("date");
  const [progress, setProgress] = useState(0);
  const [level, setLevel] = useState(1);
  const [completedTasks, setCompletedTasks] = useState(0);

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
        updateProgress(response.data);
      })
      .catch(error => console.error("❌ Ошибка загрузки задач:", error));

    axios.get(`http://localhost:5000/api/auth/me`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }})
      .then(response => {
        console.log("📌 Получен XP:", response.data.xp);
        setXp(response.data.xp || 0);
        setLevel(response.data.level);
        setCompletedTasks(response.data.completedTasks || 0);
      })
      .catch(error => console.error("❌ Ошибка загрузки XP:", error));
  }, [userId]);

  const updateProgress = (tasks) => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
    setProgress(progress);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim() || !userId) return;

    try {
      const response = await axios.post("http://localhost:5000/api/tasks/add", { text: newTaskText, userId });
      const updatedTasks = [...tasks, response.data];
      setTasks(updatedTasks);
      setNewTaskText("");
      updateProgress(updatedTasks);
    } catch (error) {
      console.error("❌ Ошибка добавления задачи:", error);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const response = await axios.post("http://localhost:5000/api/tasks/toggle", { taskId, userId });
      const updatedTasks = tasks.map(task => (task._id === taskId ? response.data.task : task));
      setTasks(updatedTasks);
      setXp(response.data.xp || 0);
      setCompletedTasks(response.data.completedTasks || 0);
      updateProgress(updatedTasks);

      if (response.data.levelUp) {
        setLevel(response.data.level);
        alert(`Поздравляем! Вы достигли уровня ${response.data.level}`);
      }
    } catch (error) {
      console.error("❌ Ошибка выполнения задачи:", error);
      alert(error.response?.data?.message || "Ошибка выполнения задачи");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/delete/${taskId}/${userId}`);
      const updatedTasks = tasks.filter(task => task._id !== taskId);
      setTasks(updatedTasks);
      updateProgress(updatedTasks);
    } catch (error) {
      console.error("❌ Ошибка удаления задачи:", error);
    }
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case "active":
        return tasks.filter(task => !task.completed);
      case "completed":
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  const getSortedTasks = (filteredTasks) => {
    switch (sort) {
      case "priority":
        // Assuming tasks have a priority field
        return filteredTasks.sort((a, b) => b.priority - a.priority);
      case "date":
      default:
        return filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const filteredTasks = getFilteredTasks();
  const sortedTasks = getSortedTasks(filteredTasks);

  const requiredTasks = 5 * Math.pow(3, level - 1);
  const tasksLeft = requiredTasks - (completedTasks || 0);

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Список задач</h2>
      <div className="mb-4 text-green-600 font-bold">XP: {xp}</div>
      <div className="mb-4 text-green-600 font-bold">Уровень: {level} (Осталось задач: {tasksLeft})</div>
      <ProgressBar progress={progress} />
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
      <div className="mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1 mr-2 rounded-lg ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Все
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-1 mr-2 rounded-lg ${filter === "active" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Не выполненные
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-1 rounded-lg ${filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Выполненные
        </button>
      </div>
      <div className="mb-4">
        <button
          onClick={() => setSort("date")}
          className={`px-4 py-1 mr-2 rounded-lg ${sort === "date" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          По дате
        </button>
        <button
          onClick={() => setSort("priority")}
          className={`px-4 py-1 rounded-lg ${sort === "priority" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          По приоритету
        </button>
      </div>
      {sortedTasks.length > 0 ? (
        sortedTasks.map((task) => (
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