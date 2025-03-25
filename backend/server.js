const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const subtaskRoutes = require('./routes/subtaskRoutes');
const friendRoutes = require('./routes/friendRoutes');
const commentRoutes = require('./routes/commentRoutes');
const habitRoutes = require('./routes/habitRoutes');
const academicTaskRoutes = require('./routes/academicTaskRoutes');
const subjectRoutes = require("./routes/subjectRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  console.error("Глобальная ошибка:", err.stack);
  res.status(500).json({ message: "Внутренняя ошибка сервера" });
});

connectDB().then(() => {
  console.log("✅ Успешное подключение к MongoDB:", process.env.MONGO_URI);
}).catch(error => {
  console.error("❌ Ошибка подключения к MongoDB:", error);
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/subtasks', subtaskRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/academic-tasks', academicTaskRoutes);
app.use("/api/subjects", subjectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));