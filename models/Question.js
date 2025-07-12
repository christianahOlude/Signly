// import mongoose from 'mongoose';
//
// const questionSchema = new mongoose.Schema({
//     options: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Option',
//         required: true
//     }],
//     correctOption: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Option',
//         required: true
//     },
//     imageUrl: {
//         type: String,
//         trim: true
//     },
//     difficulty: {
//         type: String,
//         enum: ['easy', 'medium', 'hard'],
//         default: 'easy'
//     },
//     points: {
//         type: Number,
//         default: 10
//     },
//     isActive: {
//         type: Boolean,
//         default: true
//     }
// }, {
//     timestamps: true
// });
//
// // Validate that correctOption is one of the options
// questionSchema.pre('save', function(next) {
//     if (!this.options.includes(this.correctOption)) {
//         next(new Error('Correct option must be one of the available options'));
//     }
//     next();
// });
//
// questionSchema.methods.validateAnswer = async function(answerId) {
//     return this.correctOption.equals(answerId);
// };
//
// questionSchema.methods.calculatePoints = function(timeSpent) {
//     // Basic point calculation based on difficulty and time spent
//     const basePoints = this.points;
//     const timeMultiplier = Math.max(0, 1 - (timeSpent / 30)); // Assuming 30 seconds is base time
//     return Math.round(basePoints * timeMultiplier);
// };
//
// const Question = mongoose.model('Question', questionSchema);
// export default Question;


import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({

    imageUrl: { type: String, required: true },

    difficulty: { type: String, enums: ['easy', 'medium', 'hard'], default: 'easy' },

    options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }],

    correctOption: { type: mongoose.Schema.Types.ObjectId, ref: 'Option' }
});

const Question = mongoose.model('Question', QuestionSchema);
export default Question;