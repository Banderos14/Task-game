import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentItem from './CommentItem';

const CommentList = ({ taskId }) => {
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:5000/api/comments/${taskId}`)
            .then(response => {
                setComments(response.data);
            })
            .catch(error => console.error("❌ Ошибка загрузки комментариев:", error));
    }, [taskId]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("❌ Токен отсутствует в localStorage");
                return;
            }

            const response = await axios.post(
                "http://localhost:5000/api/comments/add",
                { text: newCommentText, taskId },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setComments([...comments, response.data]);
            setNewCommentText("");
        } catch (error) {
            console.error("❌ Ошибка добавления комментария:", error);
        }
    };

    const handleDeleteComment = (commentId) => {
        setComments(comments.filter(comment => comment._id !== commentId));
    };

    return (
        <div className="mt-4">
            <h3 className="text-lg font-bold mb-2">Комментарии</h3>
            <form onSubmit={handleAddComment} className="mb-4">
                <input
                    type="text"
                    className="p-2 border rounded-lg w-full mb-2"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Добавить новый комментарий"
                />
                <button type="submit" className="px-4 py-1 bg-blue-500 text-white rounded-lg">
                    Добавить комментарий
                </button>
            </form>
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <CommentItem key={comment._id} comment={comment} onDelete={handleDeleteComment} />
                ))
            ) : (
                <p className="text-gray-500">Нет комментариев.</p>
            )}
        </div>
    );
};

export default CommentList;