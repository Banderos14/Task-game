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
    const { text, description, date, priority, reminder, userId } = req.body;

    if (!text || !userId) {
        return res.status(400).json({ message: "❌ Текст задачи и userId обязательны" });
    }

    try {
        const newTask = new Task({ text, description, date, priority, reminder, completed: false, userId });
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

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "❌ Пользователь не найден" });

        if (task.completed) {
            task.completed = false;
            user.xp = Math.max(0, (user.xp || 0) - 5); // Уменьшаем XP за отмену выполнения задачи
            user.completedTasks = Math.max(0, (user.completedTasks || 0) - 1);
            user.dailyTasksCompleted = Math.max(0, (user.dailyTasksCompleted || 0) - 1);
        } else {
            task.completed = true;
            user.xp = (user.xp || 0) + 5; // Увеличиваем XP за выполнение задачи
            user.completedTasks = (user.completedTasks || 0) + 1;
            user.dailyTasksCompleted = (user.dailyTasksCompleted || 0) + 1;
        }

        const requiredTasks = user.level === 2 ? 15 : 5 * Math.pow(3, user.level - 1);
        let levelUp = false;
        if (user.completedTasks >= requiredTasks) {
            user.level += 1;
            user.achievements.push(`Достигнут уровень ${user.level}`);
            user.completedTasks = 0; // Сбрасываем счетчик выполненных задач
            levelUp = true;
        }

        await task.save();
        await user.save();

        res.json({ task, level: user.level, achievements: user.achievements, completedTasks: user.completedTasks, xp: user.xp, levelUp, dailyTasksCompleted: user.dailyTasksCompleted });
    } catch (error) {
        console.error("❌ Ошибка переключения задачи:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ✅ Обновление задачи
router.put("/update/:taskId", async (req, res) => {
    const { taskId } = req.params;
    const { text, description, date, priority, reminder } = req.body;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "❌ Задача не найдена" });
        }

        task.text = text || task.text;
        task.description = description || task.description;
        task.date = date || task.date;
        task.priority = priority || task.priority;
        task.reminder = reminder || task.reminder;

        await task.save();
        res.json(task);
    } catch (error) {
        console.error("❌ Ошибка обновления задачи:", error);
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