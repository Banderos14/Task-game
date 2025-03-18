const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
    habit: { type: String, required: true },
    repetitions: { type: Number, required: true },
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Habit", HabitSchema);
