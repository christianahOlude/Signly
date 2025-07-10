import mongoose from 'mongoose';

const optionsSchema = new mongoose.Schema({
    optionIds: [{  type: mongoose.Schema.Types.ObjectId, ref: 'Option'}]
});

const Options = mongoose.model('Options', optionsSchema);
export default Options;