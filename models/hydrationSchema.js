import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const hydrationSchema = new Schema({
  waterML: {
    type: Number,
    required: true
  }
});

export default mongoose.model('Hydration', hydrationSchema);