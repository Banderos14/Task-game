const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: '❌ Токен не предоставлен' });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId };

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: '❌ Пользователь не найден' });
        }

        next();
    } catch (error) {
        console.error('Ошибка в middleware authenticate:', error);
        res.status(401).json({ message: '❌ Неверный токен' });
    }
};

module.exports = authMiddleware;