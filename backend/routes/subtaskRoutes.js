const express = require("express");
const Subtask = require("../models/Subtask");

const router = express.Router();

// ✅ Получение подзадач для конкретной задачи
router.get("/:taskId", async (req, res) => {
    try {
        const subtasks = await Subtask.find({ taskId: req.params.taskId });
        res.json(subtasks);
    } catch (error) {
        res.status(500).json({ message: "Ошибка загрузки подзадач" });
    }
});

// ✅ Добавление новой подзадачи
router.post("/add", async (req, res) => {
    try {
        const { text, taskId } = req.body;
        if (!text || !taskId) {
            return res.status(400).json({ message: "Текст и ID задачи обязательны" });
        }

        const newSubtask = new Subtask({ text, taskId, completed: false });
        await newSubtask.save();
        res.status(201).json(newSubtask);
    } catch (error) {
        console.error("Ошибка при добавлении подзадачи:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ✅ Изменение состояния подзадачи
router.post("/toggle", async (req, res) => {
    const { subtaskId, taskId } = req.body;

    if (!subtaskId || !taskId) {
        return res.status(400).json({ message: "❌ subtaskId и taskId обязательны" });
    }

    try {
        const subtask = await Subtask.findOne({ _id: subtaskId, taskId });
        if (!subtask) return res.status(404).json({ message: "❌ Подзадача не найдена" });

        subtask.completed = !subtask.completed;
        await subtask.save();

        res.json(subtask);
    } catch (error) {
        console.error("❌ Ошибка переключения подзадачи:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ✅ Удаление подзадачи
router.delete("/delete/:subtaskId/:taskId", async (req, res) => {
    try {
        const subtask = await Subtask.findOneAndDelete({ _id: req.params.subtaskId, taskId: req.params.taskId });
        if (!subtask) return res.status(404).json({ message: "Подзадача не найдена" });

        res.json({ message: "Подзадача удалена" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка удаления подзадачи" });
    }
});

module.exports = router;