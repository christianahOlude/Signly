import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    optionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option',
        required: true
    },

    correctAnswer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option',
        required: true
    },

    imageUrl: {
        type: String,
        trim: true
    }
});

questionSchema.methods.validateAnswer = async function(answer) {
    return this.correctAnswer.equals(answer._id);
};

const Question = mongoose.model('Question', questionSchema);
export default Question;