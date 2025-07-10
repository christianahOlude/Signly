import mongoose from 'mongoose';

const OptionsSchema = new mongoose.Schema({
    OptionIds: [{  type: mongoose.Schema.Types.ObjectId, ref: 'Option'}]
});

const Options = mongoose.model('Options', OptionsSchema);
module.exports = Options;