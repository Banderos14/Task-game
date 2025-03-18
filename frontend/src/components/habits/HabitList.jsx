import React, { useState, useEffect } from "react";
import axios from "axios";
import HabitItem from "./HabitItem";
import AddHabitModal from "./HabitModal";

const HabitList = ({ userId }) => {
  const [habits, setHabits] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!userId) {
      console.log("❌ Нет userId, не загружаем привычки.");
      return;
    }

    console.log("🟢 Загружаем привычки для userId:", userId);

    axios.get(`http://localhost:5000/api/habits/${userId}`)
      .then(response => {
        console.log("📌 Получены привычки:", response.data);
        setHabits(response.data);
      })
      .catch(error => console.error("❌ Ошибка загрузки привычек:", error));
  }, [userId]);

  const toggleHabit = async (habitId) => {
    try {
        const response = await axios.post("http://localhost:5000/api/habits/toggle", { habitId, userId });
        const updatedHabits = habits.map(habit =>
            habit._id === habitId ? { ...habit, completed: response.data.habit.completed } : habit
        );
        setHabits(updatedHabits);
    } catch (error) {
        console.error("❌ Ошибка выполнения привычки:", error);
        alert(error.response?.data?.message || "Ошибка выполнения привычки");
    }
};

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Список привычек</h2>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-4"
      >
        Добавить привычку
      </button>
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onHabitAdded={(newHabit) => {
          const updatedHabits = [...habits, newHabit];
          setHabits(updatedHabits);
        }}
        userId={userId}
      />
      {habits.length > 0 ? (
        habits.map((habit) => (
          <HabitItem
            key={habit._id} // Убедитесь, что каждый элемент имеет уникальный ключ
            habit={habit}
            toggleHabit={toggleHabit}
            deleteHabit={(habitId) => {
              const updatedHabits = habits.filter(habit => habit._id !== habitId);
              setHabits(updatedHabits);
            }}
            onUpdateHabit={(updatedHabit) => {
              const updatedHabits = habits.map(habit => (habit._id === updatedHabit._id ? updatedHabit : habit));
              setHabits(updatedHabits);
            }}
          />
        ))
      ) : (
        <p className="text-gray-500">Нет привычек в этой категории.</p>
      )}
    </div>
  );
};

export default HabitList;