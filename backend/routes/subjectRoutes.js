const express = require("express");
const Subject = require("../models/Subject");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Получение предметов
router.get("/:userId", authenticate, async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.params.userId });
    res.json(subjects);
  } catch (error) {
    console.error("Ошибка загрузки предметов:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Добавление предмета
router.post("/add", authenticate, async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ message: "Название предмета и userId обязательны" });
    }

    const newSubject = new Subject({ name, userId });
    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    console.error("Ошибка добавления предмета:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Удаление предмета
router.delete("/delete/:subjectId", authenticate, async (req, res) => {
  try {
    const { subjectId } = req.params;
    await Subject.findByIdAndDelete(subjectId);
    res.json({ message: "Предмет удален" });
  } catch (error) {
    console.error("Ошибка удаления предмета:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;