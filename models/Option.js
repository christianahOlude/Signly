import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Option text is required'],
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Option = mongoose.model('Option', optionSchema);
export default Option;