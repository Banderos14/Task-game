const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    achievements: [{ type: String }],
    level: { type: Number, default: 1 },
    completedTasks: { type: Number, default: 0 },
    dailyTasksCompleted: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    // Статистика академических задач
    academicTasksCount: { type: Number, default: 0 },
    completedAcademicTasks: { type: Number, default: 0 },
    lastAcademicTaskCompleted: { type: Date },
    // Предметы пользователя
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    // Достижения за академические задачи
    academicAchievements: [{
        type: { type: String },
        description: String,
        earnedAt: { type: Date, default: Date.now }
    }]
});

// Индексы для оптимизации запросов
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ level: 1 });
UserSchema.index({ xp: 1 });
UserSchema.index({ 'academicAchievements.type': 1 });

module.exports = mongoose.model('User', UserSchema);