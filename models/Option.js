import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({

    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },

    text: { type: String, required: true },

    isCorrect:  { type: Boolean, default: false },

    isActive: { type: Boolean, default: true}

}, { timestamps: true });

const Option = mongoose.model('Option', OptionSchema);
export default Option;