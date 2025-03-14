const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User");

const router = express.Router();

// ✅ Получение задач для конкретного пользователя
router.get("/:userId", async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.params.userId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Ошибка загрузки задач" });
    }
});

// ✅ Добавление новой задачи
router.post("/add", async (req, res) => {
    const { text, userId } = req.body;

    if (!text || !userId) {
        return res.status(400).json({ message: "❌ Текст задачи и userId обязательны" });
    }

    try {
        const newTask = new Task({ text, completed: false, userId });
        await newTask.save();
        res.json(newTask);
    } catch (error) {
        console.error("❌ Ошибка создания задачи:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ✅ Изменение состояния задачи
router.post("/toggle", async (req, res) => {
    const { taskId, userId } = req.body;

    if (!taskId || !userId) {
        return res.status(400).json({ message: "❌ taskId и userId обязательны" });
    }

    try {
        const task = await Task.findOne({ _id: taskId, userId });
        if (!task) return res.status(404).json({ message: "❌ Задача не найдена" });

        // Если задача уже выполнена, не позволяем отменить выполнение
        if (task.completed) {
            return res.status(400).json({ message: "❌ Нельзя отменить выполнение задачи" });
        }

        task.completed = true;
        await task.save();

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "❌ Пользователь не найден" });

        user.completedTasks = (user.completedTasks || 0) + 1;
        user.xp = (user.xp || 0) + 10; // Увеличиваем XP за выполнение задачи
        const requiredTasks = 5 * Math.pow(3, user.level - 1);
        let levelUp = false;
        if (user.completedTasks >= requiredTasks) {
            user.level += 1;
            user.achievements.push(`Достигнут уровень ${user.level}`);
            user.completedTasks = 0; // Сбрасываем счетчик выполненных задач
            levelUp = true;
        }

        await user.save();

        res.json({ task, level: user.level, achievements: user.achievements, completedTasks: user.completedTasks, xp: user.xp, levelUp });
    } catch (error) {
        console.error("❌ Ошибка переключения задачи:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ✅ Удаление задачи
router.delete("/delete/:taskId/:userId", async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.taskId, userId: req.params.userId });
        if (!task) return res.status(404).json({ message: "Задача не найдена" });

        res.json({ message: "Задача удалена" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка удаления задачи" });
    }
});

module.exports = router;