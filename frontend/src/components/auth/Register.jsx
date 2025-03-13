import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = ({ setUser }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", { username, email, password });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.user._id);

            setUser(response.data.user._id, response.data.token); // Устанавливаем пользователя
            navigate("/login"); // Перенаправляем на страницу задач и друзей после успешной регистрации
        } catch (error) {
            console.error("❌ Ошибка регистрации:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Ошибка при регистрации");
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded-lg text-center">
            <h2 className="text-lg font-bold">📝 Регистрация</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <input
                    type="text"
                    placeholder="Введите имя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                />
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
                    Зарегистрироваться
                </button>
            </form>
        </div>
    );
};
export default Register;