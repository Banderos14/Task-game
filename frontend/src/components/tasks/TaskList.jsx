import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskItem from "./TaskItem";
import ProgressBar from "../progress/ProgressBar";
import AddTaskModal from "./AddTaskModal";

const TaskList = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [xp, setXp] = useState(0);
  const [newTaskText, setNewTaskText] = useState("");
  const [filter, setFilter] = useState("active");
  const [progress, setProgress] = useState(0);
  const [level, setLevel] = useState(1);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        updateProgress(response.data.tasks || []);
      })
      .catch(error => console.error("❌ Ошибка загрузки XP:", error));
  }, [userId]);

  const updateProgress = (tasks) => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const requiredTasks = 5 * Math.pow(3, level - 1);
    const progress = Math.min((completedTasks / requiredTasks) * 100, 100);
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
        setProgress(0); // Сбрасываем прогресс после повышения уровня
        setTimeout(() => updateProgress(updatedTasks), 100); // Плавное увеличение прогресса
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

  const updateTask = (updatedTask) => {
    const updatedTasks = tasks.map(task => (task._id === updatedTask._id ? updatedTask : task));
    setTasks(updatedTasks);
    updateProgress(updatedTasks);
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

  const filteredTasks = getFilteredTasks();

  const requiredTasks = 5 * Math.pow(3, level - 1);
  const tasksLeft = requiredTasks - (completedTasks || 0);

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Список задач</h2>
      <div className="mb-4 text-green-600 font-bold">XP: {xp}</div>
      <div className="mb-4 text-green-600 font-bold">Уровень: {level} (Осталось задач: {tasksLeft})</div>
      <ProgressBar progress={progress} />
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-4"
      >
        Добавить задачу
      </button>
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskAdded={(newTask) => {
          const updatedTasks = [...tasks, newTask];
          setTasks(updatedTasks);
        }}
        userId={userId}
      />
      <div className="mb-4">
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-1 mr-2 rounded-lg ${filter === "active" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Сделать
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-1 rounded-lg ${filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Сделано
        </button>
      </div>
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            onUpdateTask={updateTask}
          />
        ))
      ) : (
        <p className="text-gray-500">Нет задач в этой категории.</p>
      )}
    </div>
  );
};

export default TaskList;