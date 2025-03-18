import React, { useState, useEffect } from "react";
import axios from "axios";

const FriendsList = ({ userId }) => {
  const [friends, setFriends] = useState([]);
  const [friendIdentifier, setFriendIdentifier] = useState("");

  useEffect(() => {
    if (!userId) {
      console.log("❌ Нет userId, не загружаем друзей.");
      return;
    }

    console.log("🟢 Загружаем друзей для userId:", userId);

    axios.get(`http://localhost:5000/api/friends/${userId}`)
      .then(response => {
        console.log("📌 Получены друзья:", response.data);
        setFriends(response.data);
      })
      .catch(error => console.error("❌ Ошибка загрузки друзей:", error));
  }, [userId]);

  const addFriend = async () => {
    try {
      console.log("📌 Отправка запроса на добавление друга:", { userId, friendIdentifier });
      const response = await axios.post("http://localhost:5000/api/friends/add-friend", { userId, friendIdentifier });
      console.log("📌 Ответ сервера:", response.data);
      setFriends([...friends, response.data.friend]);
      setFriendIdentifier("");
      alert("✅ Друг добавлен");
    } catch (error) {
      console.error("❌ Ошибка при добавлении друга:", error.response?.data || error);
      alert(error.response?.data?.message || "Ошибка при добавлении друга");
    }
  };

  const removeFriend = async (friendId) => {
    try {
      console.log("📌 Отправка запроса на удаление друга:", { userId, friendId });
      await axios.post("http://localhost:5000/api/friends/remove-friend", { userId, friendId });
      setFriends(friends.filter(friend => friend._id !== friendId));
      alert("✅ Друг удален");
    } catch (error) {
      console.error("❌ Ошибка при удалении друга:", error.response?.data || error);
      alert(error.response?.data?.message || "Ошибка при удалении друга");
    }
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Список друзей</h2>
      <input
        type="text"
        className="p-2 border rounded-lg w-full mb-2"
        value={friendIdentifier}
        onChange={(e) => setFriendIdentifier(e.target.value)}
        placeholder="ID или никнейм нового друга"
      />
      <button
        onClick={addFriend}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-4"
      >
        Добавить друга
      </button>
      {friends.length > 0 ? (
        friends.map((friend) => (
          <div key={friend._id} className="flex justify-between items-center mb-2">
            <span>{friend.username} (Уровень: {friend.level}, XP: {friend.xp})</span>
            <button
              onClick={() => removeFriend(friend._id)}
              className="px-2 py-1 bg-red-500 text-white rounded-lg"
            >
              Удалить
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Нет друзей в этой категории.</p>
      )}
    </div>
  );
};

export default FriendsList;