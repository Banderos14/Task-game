import React, { useState, useEffect } from "react";
import axios from "axios";
import SubtaskItem from "./SubtaskItem";
import CommentList from '../comments/CommentList';

const TaskItem = ({ task, toggleTask, deleteTask }) => {
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskText, setNewSubtaskText] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/subtasks/${task._id}`)
      .then(response => {
        setSubtasks(response.data);
      })
      .catch(error => console.error("❌ Ошибка загрузки подзадач:", error));
  }, [task._id]);

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;

    try {
      const response = await axios.post("http://localhost:5000/api/subtasks/add", { text: newSubtaskText, taskId: task._id });
      setSubtasks([...subtasks, response.data]);
      setNewSubtaskText("");
    } catch (error) {
      console.error("❌ Ошибка добавления подзадачи:", error);
    }
  };

  const toggleSubtask = async (subtaskId) => {
    try {
      const response = await axios.post("http://localhost:5000/api/subtasks/toggle", { subtaskId, taskId: task._id });
      setSubtasks(subtasks.map(subtask => (subtask._id === subtaskId ? response.data : subtask)));
    } catch (error) {
      console.error("❌ Ошибка выполнения подзадачи:", error);
    }
  };

  const deleteSubtask = async (subtaskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/subtasks/delete/${subtaskId}/${task._id}`);
      setSubtasks(subtasks.filter(subtask => subtask._id !== subtaskId));
    } catch (error) {
      console.error("❌ Ошибка удаления подзадачи:", error);
    }
  };

  return (
    <div className={`p-2 mb-2 border rounded-lg ${task.completed ? "bg-green-200" : "bg-gray-100"}`}>
      <div className="flex justify-between items-center">
        <span className={`text-lg ${task.completed ? "line-through" : ""}`}>
          {task.text}
        </span>
        <div>
          <button
            onClick={() => toggleTask(task._id)}
            className="px-4 py-1 bg-blue-500 text-white rounded-lg mr-2"
          >
            {task.completed ? "Отменить" : "Выполнено"}
          </button>
          <button
            onClick={() => deleteTask(task._id)}
            className="px-4 py-1 bg-red-500 text-white rounded-lg"
          >
            Удалить
          </button>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-md font-bold mb-2">Подзадачи</h3>
        {subtasks.map(subtask => (
          <SubtaskItem
            key={subtask._id}
            subtask={subtask}
            toggleSubtask={toggleSubtask}
            deleteSubtask={deleteSubtask}
          />
        ))}
        <form onSubmit={handleAddSubtask} className="mt-2">
          <input
            type="text"
            className="p-2 border rounded-lg w-full mb-2"
            value={newSubtaskText}
            onChange={(e) => setNewSubtaskText(e.target.value)}
            placeholder="Добавить новую подзадачу"
          />
          <button type="submit" className="px-4 py-1 bg-blue-500 text-white rounded-lg">
            Добавить подзадачу
          </button>
        </form>
      </div>
      <CommentList taskId={task._id} />
    </div>
  );
};

export default TaskItem;