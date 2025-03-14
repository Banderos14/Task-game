const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    description: { type: String },
    date: { type: Date },
    priority: { type: String, default: "low" },
    reminder: { type: Date },
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Привязка к пользователю
});

module.exports = mongoose.model("Task", TaskSchema);