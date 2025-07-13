import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({

    videoUrl: { type: String, required: true, trim: true },

    difficulty: { type: String, enums: ['easy', 'medium', 'hard'], default: 'easy' },

    options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }],

    correctOption: { type: mongoose.Schema.Types.ObjectId, ref: 'Option' },

    isActive: { type: Boolean, default: true }

}, { timestamps: true });

const Question = mongoose.model('Question', QuestionSchema);
export default Question;