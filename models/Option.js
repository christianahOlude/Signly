// import mongoose from 'mongoose';
//
// const optionSchema = new mongoose.Schema({
//
//     text: { type: String, required: [true, 'Option text is required'], trim: true },
//
//     isActive: {
//         type: Boolean,
//         default: true
//     }
// }, {
//     timestamps: true
// });
//
// const Option = mongoose.model('Option', optionSchema);
// export default Option;


import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({

    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },

    text: { type: String, required: true },

    isCorrect:  { type: Boolean, default: false }

}, { timestamps: true });

const Option = mongoose.model('Option', OptionSchema);
export default Option;