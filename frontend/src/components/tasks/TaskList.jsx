import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TaskItem from "./TaskItem";
import AddTaskModal from "./AddTaskModal";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const TaskList = ({ userId, setDailyProgress }) => {
  const [tasks, setTasks] = useState([]);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("today");

  useEffect(() => {
    const savedProgress = localStorage.getItem("dailyProgress");
    if (savedProgress) {
        setDailyProgress(parseFloat(savedProgress));
    }
  }, [setDailyProgress]);

  const updateProgress = useCallback((tasks) => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = Math.min((completedTasks / 5) * 100, 100);
    setDailyProgress(progress);
    localStorage.setItem("dailyProgress", progress);

    if (completedTasks === 5) {
      toast.success("Ежедневный челлендж выполнен!");
    }
  }, [setDailyProgress]);

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
  }, [userId, updateProgress]);

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
        setTimeout(() => updateProgress(updatedTasks), 100);
      }
    } catch (error) {
      console.error("❌ Ошибка выполнения задачи:", error);
      alert(error.response?.data?.message || "Ошибка выполнения задачи");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/delete/${taskId}`);
      const updatedTasks = tasks.filter(task => task._id !== taskId);
      setTasks(updatedTasks);
      updateProgress(updatedTasks);
    } catch (error) {
      console.error("❌ Ошибка удаления задачи:", error);
      alert(error.response?.data?.message || "Ошибка удаления задачи");
    }
  };

  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.date).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (filter === "today") return taskDate === today;
    if (filter === "tomorrow") return taskDate === tomorrow;
    if (filter === "yesterday") return taskDate === yesterday;
    return true;
  });

  // Сортировка задач: сначала невыполненные, затем выполненные
  const sortedTasks = filteredTasks.sort((a, b) => a.completed - b.completed);

  const requiredTasks = Math.pow(2, level - 1) * 3;
  const tasksLeft = requiredTasks - completedTasks;

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Список задач</h2>
      <div className="mb-4 text-green-600 font-bold">XP: {xp}</div>
      <div className="mb-4 text-green-600 font-bold">Уровень: {level} (Осталось задач: {Math.ceil(tasksLeft)})</div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter("today")} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Сегодня</button>
        <button onClick={() => setFilter("tomorrow")} className="px-4 py-2 bg-green-500 text-white rounded-lg">Завтра</button>
        <button onClick={() => setFilter("yesterday")} className="px-4 py-2 bg-yellow-500 text-white rounded-lg">Вчера</button>
      </div>
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
          const updatedTasks = [newTask, ...tasks]; // Добавляем новую задачу в начало списка
          setTasks(updatedTasks);
          updateProgress(updatedTasks);
        }}
        userId={userId}
        filter={filter}
      />
      {sortedTasks.length > 0 ? (
        sortedTasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            onUpdateTask={(updatedTask) => {
              const updatedTasks = tasks.map(task => (task._id === updatedTask._id ? updatedTask : task));
              setTasks(updatedTasks);
              updateProgress(updatedTasks);
            }}
          />
        ))
      ) : (
        <p className="text-gray-500">Нет задач в этой категории.</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default TaskList;