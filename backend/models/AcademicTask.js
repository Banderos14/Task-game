const mongoose = require("mongoose");

const AcademicTaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date, required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
});

// Индексы для оптимизации запросов
AcademicTaskSchema.index({ userId: 1, deadline: 1 });
AcademicTaskSchema.index({ userId: 1, completed: 1 });
AcademicTaskSchema.index({ subject: 1 });

module.exports = mongoose.model("AcademicTask", AcademicTaskSchema);