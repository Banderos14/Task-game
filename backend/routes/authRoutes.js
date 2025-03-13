const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require("../middleware/authenticate"); // Middleware для проверки токена

const router = express.Router();

// ✅ Регистрация с автоматическим токеном
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "❌ Этот email уже зарегистрирован" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, email, password: hashedPassword });

        console.log("📌 Сохранение пользователя:", user);  // ✅ Проверка перед сохранением
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ token, user });
    } catch (error) {
        console.error("❌ Ошибка регистрации:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ✅ Вход в систему (логин)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "❌ Пользователь не найден" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "❌ Неверный пароль" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ token, user });
    } catch (error) {
        console.error("Ошибка входа:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ✅ Получить список всех пользователей (без паролей)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Не отправляем пароли
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: '❌ Ошибка получения пользователей', error });
    }
});

// ✅ Маршрут /auth/me для проверки токена
router.get("/me", authMiddleware, async (req, res) => {
    try {
        console.log("📌 Проверка пользователя с ID:", req.user.userId);
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            console.log("❌ Пользователь не найден");
            return res.status(404).json({ message: "❌ Пользователь не найден" });
        }

        res.json(user);
    } catch (error) {
        console.error("Ошибка получения пользователя:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

module.exports = router;