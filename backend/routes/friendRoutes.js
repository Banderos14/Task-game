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
        const { userId, friendId } = req.body;

        if (!userId || !friendId) {
            return res.status(400).json({ message: "❌ userId и friendId обязательны" });
        }

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: "❌ Пользователь не найден" });
        }

        if (user.friends.includes(friendId)) {
            return res.status(400).json({ message: "❌ Этот пользователь уже в друзьях" });
        }

        user.friends.push(friendId);
        friend.friends.push(userId);

        await user.save();
        await friend.save();

        res.json({ message: "✅ Друг добавлен", friend });
    } catch (error) {
        console.error("Ошибка при добавлении друга:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Удаление друга
router.post("/remove-friend", async (req, res) => {
    const { userId, friendId } = req.body;

    console.log("📌 Запрос на удаление друга:", { userId, friendId });

    if (!userId || !friendId) {
        return res.status(400).json({ message: "❌ userId и friendId обязательны" });
    }

    try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user) {
            return res.status(404).json({ message: `❌ Пользователь ${userId} не найден` });
        }
        if (!friend) {
            return res.status(404).json({ message: `❌ Друг ${friendId} не найден` });
        }

        if (!user.friends.includes(friendId)) {
            return res.status(400).json({ message: "❌ Этот пользователь не в списке друзей" });
        }

        await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
        await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

        console.log("✅ Друг успешно удален:", friendId);
        res.json({ message: "✅ Друг удален" });
    } catch (error) {
        console.error("❌ Ошибка при удалении друга:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

module.exports = router;