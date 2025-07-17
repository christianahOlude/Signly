import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({

    questionVideoUrl: { type: String, required: true, trim: true },

    options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }],

    answer: { type: mongoose.Schema.Types.ObjectId, ref: 'Option' },

    isActive: { type: Boolean, default: true }

}, { timestamps: true });

const Question = mongoose.model('Question', QuestionSchema);
export default Question;