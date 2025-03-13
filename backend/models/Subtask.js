const mongoose = require("mongoose");

const SubtaskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true }
});

module.exports = mongoose.model("Subtask", SubtaskSchema);