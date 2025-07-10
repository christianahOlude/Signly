import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  videoUrl: {
    type: String,
    trim: true,
    required: true
  }
});

const Option = mongoose.model('Option', optionSchema);
export default Option;