const express = require("express");
const authenticate = require("../middleware/authenticate");
const AcademicTask = require("../models/AcademicTask");
const User = require("../models/User");

const router = express.Router();

// Получение всех академических задач пользователя
router.get("/:userId", authenticate, async (req, res) => {
    try {
        const tasks = await AcademicTask.find({ userId: req.params.userId })
            .populate('subject', 'name')
            .sort({ deadline: 1 });
        res.json(tasks);
    } catch (error) {
        console.error("Ошибка загрузки академических задач:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Добавление новой задачи
router.post("/", authenticate, async (req, res) => {
    try {
        const { title, description, deadline, subject, priority, userId } = req.body;

        if (!title || !deadline || !userId) {
            return res.status(400).json({ message: "❌ Все обязательные поля должны быть заполнены" });
        }

        const newTask = new AcademicTask({
            title,
            description: description || "",
            deadline: new Date(deadline),
            subject,
            priority: priority || "medium",
            userId,
            completed: false
        });

        await newTask.save();

        // Обновляем статистику пользователя
        const user = await User.findById(userId);
        if (user) {
            user.academicTasksCount = (user.academicTasksCount || 0) + 1;
            await user.save();
        }

        res.status(201).json(newTask);
    } catch (error) {
        console.error("❌ Ошибка создания академической задачи:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Переключение состояния задачи (выполнено/не выполнено)
router.post("/:taskId/complete", authenticate, async (req, res) => {
    try {
        const task = await AcademicTask.findById(req.params.taskId);
        if (!task) {
            return res.status(404).json({ message: "❌ Задача не найдена" });
        }

        const user = await User.findById(task.userId);
        if (!user) {
            return res.status(404).json({ message: "❌ Пользователь не найден" });
        }

        task.completed = !task.completed;
        await task.save();

        // Обновляем статистику пользователя
        if (task.completed) {
            user.xp = (user.xp || 0) + 10; // Начисляем XP за выполнение академической задачи
            user.completedAcademicTasks = (user.completedAcademicTasks || 0) + 1;
        } else {
            user.xp = Math.max(0, (user.xp || 0) - 10); // Отнимаем XP при отмене выполнения
            user.completedAcademicTasks = Math.max(0, (user.completedAcademicTasks || 0) - 1);
        }

        await user.save();

        res.json({ 
            task,
            userStats: {
                xp: user.xp,
                completedAcademicTasks: user.completedAcademicTasks
            }
        });
    } catch (error) {
        console.error("❌ Ошибка переключения состояния задачи:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Удаление задачи
router.delete("/:taskId", authenticate, async (req, res) => {
    try {
        const task = await AcademicTask.findById(req.params.taskId);
        if (!task) {
            return res.status(404).json({ message: "❌ Задача не найдена" });
        }

        // Обновляем статистику пользователя
        const user = await User.findById(task.userId);
        if (user) {
            user.academicTasksCount = Math.max(0, (user.academicTasksCount || 0) - 1);
            if (task.completed) {
                user.completedAcademicTasks = Math.max(0, (user.completedAcademicTasks || 0) - 1);
            }
            await user.save();
        }

        await AcademicTask.deleteOne({ _id: req.params.taskId });
        res.json({ message: "✅ Задача успешно удалена" });
    } catch (error) {
        console.error("❌ Ошибка удаления задачи:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Обновление задачи
router.put("/:taskId", authenticate, async (req, res) => {
    try {
        const { title, description, deadline, subject, priority } = req.body;
        const task = await AcademicTask.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({ message: "❌ Задача не найдена" });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.deadline = deadline ? new Date(deadline) : task.deadline;
        task.subject = subject || task.subject;
        task.priority = priority || task.priority;

        await task.save();
        res.json(task);
    } catch (error) {
        console.error("❌ Ошибка обновления задачи:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

module.exports = router;