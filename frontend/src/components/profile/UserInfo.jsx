import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';

const UserInfo = ({ user, progress }) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(user);
    const [userProgress, setUserProgress] = useState(progress);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserData(response.data);
                const completedTasks = response.data.dailyTasksCompleted || 0;
                let progress = Math.min((completedTasks / 5) * 100, 100);

                // Загружаем сохраненный прогресс, если он есть
                const savedProgress = localStorage.getItem("dailyProgress");
                if (savedProgress) {
                    progress = parseFloat(savedProgress);
                }
                setUserProgress(progress);
            } catch (error) {
                console.error("❌ Ошибка загрузки данных пользователя:", error);
            }
        };

        fetchUserData();
    }, []);

    if (!userData) return null;

    const requiredTasks = 5 * Math.pow(3, userData.level - 1);
    const tasksLeft = requiredTasks - (userData.completedTasks || 0);

    return (
        <div className="p-4 bg-white shadow rounded-lg text-center mb-4">
            <h2 className="text-lg font-bold">👤 Информация о пользователе</h2>
            <p className="text-blue-600 font-mono">ID: {userData._id}</p>
            <p className="text-blue-600 font-mono">Имя пользователя: {userData.username}</p>
            <p className="text-blue-600 font-mono">Email: {userData.email}</p>
            <p className="text-blue-600 font-mono">Уровень: {userData.level} (Осталось задач: {tasksLeft})</p>
            <p className="text-blue-600 font-mono">XP: {userData.xp}</p>
            <h3 className="text-lg font-bold mt-4">Достижения</h3>
            <ul>
                {userData.achievements.map((achievement, index) => (
                    <li key={index} className="text-blue-600 font-mono">{achievement}</li>
                ))}
            </ul>
            <div className="mt-4">
                <h3 className="text-lg font-bold">Прогресс</h3>
                <div className="w-24 h-24 mx-auto">
                    <CircularProgressbar
                        value={userProgress}
                        maxValue={100}
                        text={`${userProgress}%`}
                        styles={buildStyles({
                            pathColor: `rgba(0, 123, 255, ${userProgress / 100})`,
                            textColor: '#000',
                            trailColor: '#d6d6d6',
                        })}
                    />
                </div>
            </div>
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