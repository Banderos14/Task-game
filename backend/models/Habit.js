const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
    habit: { type: String, required: true },
    repetitions: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Habit", HabitSchema);