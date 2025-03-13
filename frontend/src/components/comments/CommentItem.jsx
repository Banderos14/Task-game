import React from 'react';
import axios from 'axios';

const CommentItem = ({ comment, onDelete }) => {
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("❌ Токен отсутствует в localStorage.");
                return;
            }
    
            await axios.delete(
                `http://localhost:5000/api/comments/delete/${comment._id}`,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`, 
                        "Content-Type": "application/json"
                    }
                }
            );
    
            onDelete(comment._id);
        } catch (error) {
            console.error("❌ Ошибка удаления комментария:", error.response?.data || error.message);
        }
    };

    return (
        <div className="p-2 border-b border-gray-200 flex justify-between items-center">
            <div>
                <p className="text-sm text-gray-600">{comment.text}</p>
                <p className="text-xs text-gray-400">Автор: {comment.authorUsername}</p>
            </div>
            <button onClick={handleDelete} className="text-red-500 text-xs">Удалить</button>
        </div>
    );
};

export default CommentItem;