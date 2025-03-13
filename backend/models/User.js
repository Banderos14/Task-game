const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    userId: { 
        type: String, 
        unique: true, 
        default: () => new mongoose.Types.ObjectId().toString()
    },
    score: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 }
});

module.exports = mongoose.model('User', UserSchema);