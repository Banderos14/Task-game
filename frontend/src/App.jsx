import { useEffect, useState, useCallback } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import TaskList from "./components/tasks/TaskList";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import FriendsList from "./components/friends/FriendsList";
import UserInfo from "./components/profile/UserInfo";
import ProfileButton from "./components/profile/ProfileButton";
import HabitList from "./components/habits/HabitList";
import axios from "axios";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Используем null, чтобы знать, что проверка еще не выполнена
    const [user, setUser] = useState(null);
    const [dailyProgress, setDailyProgress] = useState(0);
    const navigate = useNavigate();

    const loadUserData = useCallback(async () => {
        const token = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId");

        if (!token || !storedUserId) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const response = await axios.get("http://localhost:5000/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
            setIsAuthenticated(true);
            const today = new Date().toISOString().split('T')[0];
            const lastLogin = localStorage.getItem("lastLogin");
            if (lastLogin !== today) {
                setDailyProgress(0);
                localStorage.setItem("lastLogin", today);
            } else {
                const completedTasks = response.data.dailyTasksCompleted || 0;
                const progress = Math.min((completedTasks / 5) * 100, 100);
                setDailyProgress(progress);
                localStorage.setItem("dailyProgress", progress); // Сохранение в localStorage
            }
        } catch (error) {
            console.error("❌ Ошибка загрузки пользователя:", error);
            setIsAuthenticated(false);
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        loadUserData();
        const savedProgress = localStorage.getItem("dailyProgress");
        if (savedProgress) {
            setDailyProgress(parseFloat(savedProgress));
        }
    }, [loadUserData]);

    const handleLogin = (userId, token) => {
        localStorage.setItem("userId", userId);
        localStorage.setItem("token", token);
        setUser({ _id: userId });
        setIsAuthenticated(true);
        navigate("/dashboard");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        setUser(null);
        navigate("/login");
    };

    // Показываем индикатор загрузки, пока статус isAuthenticated не определён
    if (isAuthenticated === null) {
        return <div className="flex items-center justify-center min-h-screen text-lg">Загрузка...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <nav className="mb-4 flex gap-4">
                {!isAuthenticated ? (
                    <>
                        <button onClick={() => navigate("/register")} className="text-blue-600">Регистрация</button>
                        <button onClick={() => navigate("/login")} className="text-blue-600">Вход</button>
                    </>
                ) : (
                    <>
                        <ProfileButton user={user} progress={dailyProgress} />
                        <button onClick={handleLogout} className="text-red-600">Выйти</button>
                    </>
                )}
            </nav>

            <Routes>
                <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
                <Route path="/register" element={<Register setUser={handleLogin} />} />
                <Route path="/login" element={<Login setUser={handleLogin} />} />
                <Route path="/dashboard" element={
                    isAuthenticated ? (
                        <>
                            <TaskList userId={user ? user._id : null} setDailyProgress={setDailyProgress} />
                            <FriendsList userId={user ? user._id : null} setUser={setUser} setIsAuthenticated={setIsAuthenticated} />
                            <HabitList userId={user ? user._id : null} />
                        </>
                    ) : <Navigate to="/login" />
                } />
                <Route path="/profile" element={isAuthenticated ? <UserInfo user={user} progress={dailyProgress} /> : <Navigate to="/login" />} />
            </Routes>
        </div>
    );
};

export default App;