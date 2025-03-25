import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import '../features/academic_tasks/styles/academicTasks.css';

export const AcademicTasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    subject: '',
    deadline: '',
    priority: 'medium'
  });
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);

  const fetchSubjects = useCallback(async () => {
    if (!user || !user.id) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/subjects/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error('Ошибка при загрузке предметов:', error);
      setError('Не удалось загрузить предметы');
    }
  }, [user]);

  const fetchTasks = useCallback(async () => {
    if (!user || !user.id) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/academic-tasks/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Ошибка при загрузке задач:', error);
      setError('Не удалось загрузить задачи');
    }
  }, [user]);

  useEffect(() => {
    if (user && user.id) {
      fetchSubjects();
      fetchTasks();
    }
  }, [user, user?.id, fetchSubjects, fetchTasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/academic-tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...newTask,
          userId: user.id
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTasks([...tasks, data]);
      setNewTask({
        title: '',
        description: '',
        subject: '',
        deadline: '',
        priority: 'medium'
      });
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
      setError('Не удалось создать задачу');
    }
  };

  const handleTaskComplete = async (taskId) => {
    try {
      const response = await fetch(`/api/academic-tasks/${taskId}/complete`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Ошибка при выполнении задачи:', error);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Новая академическая задача</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Название</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Описание</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Предмет</label>
              <select
                value={newTask.subject}
                onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Выберите предмет</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Срок выполнения</label>
              <input
                type="datetime-local"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Приоритет</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Добавить задачу
            </button>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Академические задачи</h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {subjects.find(s => s.id === task.subject)?.name || 'Без предмета'}
                      </span>
                      <span className="text-sm text-gray-500">
                        Срок: {new Date(task.deadline).toLocaleString()}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority === 'high' ? 'Высокий' :
                         task.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTaskComplete(task.id)}
                    className={`ml-4 px-3 py-1 rounded-md text-sm font-medium ${
                      task.completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {task.completed ? 'Выполнено' : 'Выполнить'}
                  </button>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="text-center text-gray-500">Нет академических задач</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}