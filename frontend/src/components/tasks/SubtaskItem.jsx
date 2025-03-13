import React from "react";

const SubtaskItem = ({ subtask, toggleSubtask, deleteSubtask }) => {
  return (
    <div
      className={`p-2 mb-2 flex justify-between items-center border rounded-lg ${
        subtask.completed ? "bg-green-200" : "bg-gray-100"
      }`}
    >
      <span className={`text-lg ${subtask.completed ? "line-through" : ""}`}>
        {subtask.text}
      </span>

      <div>
        {/* Кнопка для переключения состояния подзадачи */}
        <button
          onClick={() => toggleSubtask(subtask._id)}
          className="px-4 py-1 bg-blue-500 text-white rounded-lg mr-2"
        >
          {subtask.completed ? "Отменить" : "Выполнено"}
        </button>

        {/* Кнопка для удаления подзадачи */}
        <button
          onClick={() => deleteSubtask(subtask._id)}
          className="px-4 py-1 bg-red-500 text-white rounded-lg"
        >
          Удалить
        </button>
      </div>
    </div>
  );
};

export default SubtaskItem;