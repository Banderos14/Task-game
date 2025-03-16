import React, { useState } from "react";
import axios from "axios";

const HabitModal = ({ isOpen, onClose, onHabitAdded, userId }) => {
  const [habit, setHabit] = useState("");
  const [repetitions, setRepetitions] = useState(1);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!habit.trim() || !userId) return;

    try {
      const response = await axios.post("http://localhost:5000/api/habits/add", {
        habit,
        repetitions,
        userId,
      });
      onHabitAdded(response.data);
      // Сбрасываем состояние полей формы
      setHabit("");
      setRepetitions(1);
      onClose();
    } catch (error) {
      console.error("❌ Ошибка добавления привычки:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Добавить привычку</h2>
        <form onSubmit={handleAddHabit}>
          <input
            type="text"
            className="p-2 border rounded-lg w-full mb-2"
            value={habit}
            onChange={(e) => setHabit(e.target.value)}
            placeholder="Название привычки"
          />
          <input
            type="number"
            className="p-2 border rounded-lg w-full mb-2"
            value={repetitions}
            onChange={(e) => setRepetitions(e.target.value)}
            placeholder="Количество повторений в день"
            min="1"
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
              Добавить привычку
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitModal;