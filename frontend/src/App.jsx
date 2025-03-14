import { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import TaskList from "./components/tasks/TaskList";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import FriendsList from "./components/friends/FriendsList";
import UserInfo from "./components/profile/UserInfo";
import axios from "axios";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId");

        if (!token || !storedUserId) {
            setIsAuthenticated(false);
            return;
        }

        axios.get("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setUser(response.data);
            setIsAuthenticated(true);
        })
        .catch(error => {
            console.error("❌ Ошибка загрузки пользователя:", error);
            setIsAuthenticated(false);
            navigate("/login");
        });
    }, [navigate]);

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
                        <button onClick={() => navigate("/profile")} className="text-blue-600">Профиль</button>
                        <button onClick={handleLogout} className="text-red-600">Выйти</button>
                    </>
                )}
            </nav>

            <Routes>
                <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
                <Route path="/register" element={<Register setUser={handleLogin} />} />
                <Route path="/login" element={<Login setUser={handleLogin} />} />
                <Route path="/dashboard" element={isAuthenticated ? (
                    <>
                        <TaskList userId={user ? user._id : null} />
                        <FriendsList userId={user ? user._id : null} setUser={setUser} setIsAuthenticated={setIsAuthenticated} />
                    </>
                ) : (
                    <Navigate to="/login" />
                )} />
                <Route path="/profile" element={isAuthenticated ? <UserInfo user={user} /> : <Navigate to="/login" />} />
            </Routes>
        </div>
    );
};

export default App;