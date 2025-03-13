import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.user._id);

            setUser(response.data.user._id, response.data.token); // Устанавливаем пользователя
            navigate("/dashboard"); // Перенаправляем на страницу задач и друзей после успешного входа
        } catch (error) {
            alert(error.response?.data?.message || "Ошибка при входе");
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded-lg text-center">
            <h2 className="text-lg font-bold">🔑 Вход</h2>
            <form onSubmit={handleLogin} className="mt-4">
                <input
                    type="email"
                    placeholder="Введите email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                />
                <input
                    type="password"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Войти
                </button>
            </form>
        </div>
    );
};

export default Login;