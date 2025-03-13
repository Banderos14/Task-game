import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserInfo = ({ user }) => {
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <div className="p-4 bg-white shadow rounded-lg text-center mb-4">
            <h2 className="text-lg font-bold">👤 Информация о пользователе</h2>
            <p className="text-blue-600 font-mono">ID: {user._id}</p>
            <p className="text-blue-600 font-mono">Имя пользователя: {user.username}</p>
            <p className="text-blue-600 font-mono">Email: {user.email}</p>
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