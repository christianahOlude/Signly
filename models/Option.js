import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  name: String,
  videoUrl: String
});

const Option = mongoose.model('Option', OptionSchema);
module.exports = Option;