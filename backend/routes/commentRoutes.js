const express = require("express");
const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const User = require("../models/User");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// ✅ Получение комментариев (доступно всем)
router.get("/:taskId", async (req, res) => {
    try {
        const comments = await Comment.find({ taskId: req.params.taskId }).populate('author', 'username');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: "Ошибка загрузки комментариев" });
    }
});

// ✅ Добавление комментария (только для авторизованных пользователей)
router.post("/add", authenticate, async (req, res) => {
    try {
        const { text, taskId } = req.body;
        if (!text || !taskId) {
            return res.status(400).json({ message: "Текст и ID задачи обязательны" });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        const newComment = new Comment({ text, taskId, author: user._id, authorUsername: user.username });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        console.error("Ошибка при добавлении комментария:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ✅ Удаление комментария (только для автора или администратора)
router.delete("/delete/:commentId", authenticate, async (req, res) => {
    try {
        const { commentId } = req.params;

        // Проверяем, валиден ли commentId (если ID некорректный, сервер выбросит 500)
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ message: "❌ Некорректный ID комментария" });
        }

        // Проверяем, существует ли комментарий перед удалением
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "❌ Комментарий не найден" });
        }

        // Удаляем комментарий
        await Comment.findByIdAndDelete(commentId);
        res.json({ message: "✅ Комментарий успешно удалён" });

    } catch (error) {
        console.error("❌ Ошибка удаления комментария:", error);
        res.status(500).json({ message: "❌ Ошибка сервера при удалении комментария" });
    }
});

module.exports = router;