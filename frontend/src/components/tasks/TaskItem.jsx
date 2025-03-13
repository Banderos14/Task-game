import React from "react";

const TaskItem = ({ task, toggleTask, deleteTask }) => {
  return (
    <div
      className={`p-2 mb-2 flex justify-between items-center border rounded-lg ${
        task.completed ? "bg-green-200" : "bg-gray-100"
      }`}
    >
      <span className={`text-lg ${task.completed ? "line-through" : ""}`}>
        {task.text}
      </span>

      <div>
        {/* Кнопка для переключения состояния задачи */}
        <button
          onClick={() => toggleTask(task._id)}
          className="px-4 py-1 bg-blue-500 text-white rounded-lg mr-2"
        >
          {task.completed ? "Отменить" : "Выполнено"}
        </button>

        {/* Кнопка для удаления задачи */}
        <button
          onClick={() => deleteTask(task._id)}
          className="px-4 py-1 bg-red-500 text-white rounded-lg"
        >
          Удалить
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
