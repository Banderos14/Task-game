import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserInfo = ({ user }) => {
    const navigate = useNavigate();

    if (!user) return null;

    const requiredTasks = 5 * Math.pow(3, user.level - 1);
    const tasksLeft = requiredTasks - (user.completedTasks || 0);

    return (
        <div className="p-4 bg-white shadow rounded-lg text-center mb-4">
            <h2 className="text-lg font-bold">👤 Информация о пользователе</h2>
            <p className="text-blue-600 font-mono">ID: {user._id}</p>
            <p className="text-blue-600 font-mono">Имя пользователя: {user.username}</p>
            <p className="text-blue-600 font-mono">Email: {user.email}</p>
            <p className="text-blue-600 font-mono">Уровень: {user.level} (Осталось задач: {tasksLeft})</p>
            <p className="text-blue-600 font-mono">XP: {user.xp}</p>
            <h3 className="text-lg font-bold mt-4">Достижения</h3>
            <ul>
                {user.achievements.map((achievement, index) => (
                    <li key={index} className="text-blue-600 font-mono">{achievement}</li>
                ))}
            </ul>
            <button
                onClick={() => navigate("/dashboard")}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
                Вернуться к задачам и друзьям
            </button>
        </div>
    );
};

export default UserInfo;