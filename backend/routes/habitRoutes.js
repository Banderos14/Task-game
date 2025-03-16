const express = require("express");
const Habit = require("../models/Habit");

const router = express.Router();

// Получение привычек для конкретного пользователя
router.get("/:userId", async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.params.userId });
        res.json(habits);
    } catch (error) {
        res.status(500).json({ message: "Ошибка загрузки привычек" });
    }
});

// Добавление новой привычки
router.post("/add", async (req, res) => {
    const { habit, repetitions, userId } = req.body;

    if (!habit || !repetitions || !userId) {
        return res.status(400).json({ message: "❌ Название привычки, количество повторений и userId обязательны" });
    }

    try {
        const newHabit = new Habit({ habit, repetitions, userId });
        await newHabit.save();
        res.json(newHabit);
    } catch (error) {
        console.error("❌ Ошибка создания привычки:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Обновление привычки
router.put("/update/:habitId", async (req, res) => {
    const { habitId } = req.params;
    const { habit, repetitions } = req.body;

    try {
        const existingHabit = await Habit.findById(habitId);
        if (!existingHabit) {
            return res.status(404).json({ message: "❌ Привычка не найдена" });
        }

        existingHabit.habit = habit || existingHabit.habit;
        existingHabit.repetitions = repetitions || existingHabit.repetitions;

        await existingHabit.save();
        res.json(existingHabit);
    } catch (error) {
        console.error("❌ Ошибка обновления привычки:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Удаление привычки
router.delete("/delete/:habitId/:userId", async (req, res) => {
    try {
        const habit = await Habit.findOneAndDelete({ _id: req.params.habitId, userId: req.params.userId });
        if (!habit) return res.status(404).json({ message: "Привычка не найдена" });

        res.json({ message: "Привычка удалена" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка удаления привычки" });
    }
});

// Изменение состояния привычки
router.post("/toggle", async (req, res) => {
    const { habitId, userId } = req.body;

    if (!habitId || !userId) {
        return res.status(400).json({ message: "❌ habitId и userId обязательны" });
    }

    try {
        const habit = await Habit.findOne({ _id: habitId, userId });
        if (!habit) return res.status(404).json({ message: "❌ Привычка не найдена" });

        habit.completed = !habit.completed;
        await habit.save();

        res.json(habit);
    } catch (error) {
        console.error("❌ Ошибка переключения привычки:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

module.exports = router;