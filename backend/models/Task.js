const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    description: { type: String },
    date: { type: Date },
    priority: { type: String, default: "low" },
    reminder: { type: Date },
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Привязка к пользователю
    createdAt: { type: Date, default: Date.now } // Добавляем поле для времени создания задачи
});

// Коррекция часового пояса для напоминаний перед сохранением
TaskSchema.pre("save", function (next) {
    if (this.reminder) {
        this.reminder = new Date(this.reminder.getTime() - this.reminder.getTimezoneOffset() * 60000);
    }
    next();
});

module.exports = mongoose.model("Task", TaskSchema);