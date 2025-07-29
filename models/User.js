import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [20, 'Username cannot exceed 20 characters']
    },
    streakCount: { type: Number, default: 0 },
    lastChallengeAt: { type: Date, default: null }
});

const User = mongoose.model('User', userSchema);

export default User;