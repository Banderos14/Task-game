const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Получение списка друзей
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate("friends", "username email xp level");
        if (!user) {
            return res.status(404).json({ message: "❌ Пользователь не найден" });
        }

        res.json(user.friends);
    } catch (error) {
        console.error("❌ Ошибка при загрузке друзей:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Добавление друга
router.post("/add-friend", async (req, res) => {
    try {
        const { userId, friendIdentifier } = req.body;

        if (!userId || !friendIdentifier) {
            return res.status(400).json({ message: "❌ userId и friendIdentifier обязательны" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "❌ Пользователь не найден" });
        }

        let friend;
        // Попробуем найти друга по никнейму
        friend = await User.findOne({ username: { $regex: new RegExp("^" + friendIdentifier + "$", "i") } });

        // Если не нашли по никнейму, попробуем найти по ID
        if (!friend) {
            try {
                friend = await User.findById(friendIdentifier);
            } catch (error) {
                // Игнорируем ошибку, если friendIdentifier не является валидным ObjectId
            }
        }

        if (!friend) {
            return res.status(404).json({ message: "❌ Друг не найден" });
        }

        if (user.friends.some(id => id.toString() === friend._id.toString())) {
            return res.status(400).json({ message: "❌ Этот пользователь уже в друзьях" });
        }

        user.friends.push(friend._id);
        friend.friends.push(userId);

        await user.save();
        await friend.save();

        res.json({ 
            message: "✅ Друг добавлен", 
            friend: { 
                _id: friend._id, 
                username: friend.username, 
                xp: friend.xp, 
                level: friend.level 
            }
        });

    } catch (error) {
        console.error("Ошибка при добавлении друга:", error); // Теперь сервер покажет точную ошибку
        res.status(500).json({ message: "Ошибка сервера", error: error.toString() });
    }
});

// Удаление друга
router.post("/remove-friend", async (req, res) => {
    const { userId, friendId } = req.body;

    if (!userId || !friendId) {
        return res.status(400).json({ message: "❌ userId и friendId обязательны" });
    }

    try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: "❌ Пользователь не найден" });
        }

        user.friends = user.friends.filter(id => id.toString() !== friendId);
        friend.friends = friend.friends.filter(id => id.toString() !== userId);

        await user.save();
        await friend.save();

        res.json({ message: "✅ Друг удален" });
    } catch (error) {
        console.error("Ошибка при удалении друга:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

module.exports = router;