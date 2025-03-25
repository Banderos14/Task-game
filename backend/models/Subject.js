const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  color: { type: String, default: '#4B5563' }, // Цвет для визуального отображения
  icon: { type: String }, // Иконка предмета (можно использовать Font Awesome или другие иконки)
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Кто создал предмет
  isDefault: { type: Boolean, default: false } // Флаг для стандартных предметов
});

// Индексы для оптимизации запросов
SubjectSchema.index({ name: 1 });
SubjectSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Subject", SubjectSchema);