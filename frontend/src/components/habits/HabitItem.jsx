import React, { useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const HabitItem = ({ habit, toggleTask, deleteHabit, onUpdateHabit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [habitText, setHabitText] = useState(habit.habit);
  const [repetitions, setRepetitions] = useState(habit.repetitions);

  const handleUpdateHabit = async () => {
    try {
      const updatedHabit = {
        ...habit,
        habit: habitText,
        repetitions,
      };
      await axios.put(`http://localhost:5000/api/habits/update/${habit._id}`, updatedHabit);
      onUpdateHabit(updatedHabit);
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Ошибка обновления привычки:", error);
    }
  };

  return (
    <div className={`p-2 mb-2 border rounded-lg ${habit.completed ? "bg-green-200" : "bg-gray-100"}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className={`text-lg ${habit.completed ? "line-through" : ""}`}>
            {habit.habit}
          </span>
          <span className="text-sm text-gray-500 ml-2">Повторений в день: {habit.repetitions}</span>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => toggleTask(habit._id)}
            className={`w-6 h-6 rounded-full bg-blue-500 mr-2`}
          ></button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-2 py-1 bg-yellow-500 text-white rounded-lg mr-2 flex items-center"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => deleteHabit(habit._id)}
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
            value={habitText}
            onChange={(e) => setHabitText(e.target.value)}
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
          <button
            onClick={handleUpdateHabit}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default HabitItem;