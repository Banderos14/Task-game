import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FriendsList = ({ userId, setUser, setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);
    const [newFriendId, setNewFriendId] = useState("");

    useEffect(() => {
        if (!userId) return;

        axios.get(`http://localhost:5000/api/friends/${userId}`)
            .then(response => {
                const uniqueFriends = Array.from(new Map(response.data.map(friend => [friend._id, friend])).values());
                setFriends(uniqueFriends);
            })
            .catch(error => {
                console.error("❌ Ошибка загрузки друзей:", error);
                setIsAuthenticated(false);
                setUser(null);
                navigate("/login");
            });
    }, [userId, navigate, setIsAuthenticated, setUser]);

    const addFriend = async (friendId) => {
        if (!userId || !friendId) {
            alert("❌ Ошибка: userId и friendId обязательны!");
            return;
        }

        if (userId === friendId) {
            alert("❌ Ошибка: Нельзя добавить самого себя в друзья!");
            return;
        }

        if (friends.some(friend => friend._id === friendId)) {
            alert("❌ Ошибка: Этот пользователь уже у вас в друзьях!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/friends/add-friend", {
                userId,
                friendId
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            setFriends([...friends, response.data.friend]);
            setNewFriendId("");
        } catch (error) {
            console.error("❌ Ошибка при добавлении друга:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Ошибка при добавлении друга");
        }
    };

    const removeFriend = async (friendId) => {
        try {
            await axios.post("http://localhost:5000/api/friends/remove-friend", 
                { userId, friendId },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
             );
            setFriends(friends.filter(friend => friend._id !== friendId));
        } catch (error) {
            console.error("❌ Ошибка при удалении друга:", error);
            alert(error.response?.data?.message || "Ошибка при удалении друга");
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded-lg mt-4 text-center">
            <h2 className="text-lg font-bold">🎮 Друзья</h2>
            {friends.length > 0 ? (
                <ul className="mt-2">
                    {friends.map(friend => (
                        friend?._id ? (
                            <li key={friend._id} className="p-2 border-b flex justify-between items-center">
                                <div>
                                    <span className="font-bold">{friend.username}</span>
                                    <span className="text-gray-500 ml-2">XP: {friend.xp}</span>
                                    <span className="text-gray-500 ml-2">Level: {friend.level}</span>
                                </div>
                                <button 
                                    onClick={() => removeFriend(friend._id)}
                                    className="ml-2 bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Удалить
                                </button>
                            </li>
                        ) : null
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 mt-2">У вас пока нет друзей.</p>
            )}

            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Введите ID друга"
                    value={newFriendId}
                    onChange={(e) => setNewFriendId(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                />
                <button
                    onClick={() => addFriend(newFriendId)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Добавить друга
                </button>
            </div>
        </div>
    );
};

export default FriendsList;