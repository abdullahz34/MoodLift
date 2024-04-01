import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const nutritionSchema = new Schema({
  calories: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  fats: {
    type: Number,
    required: true
  },
  carbs: {
    type: Number,
    required: true
  }
});

export default mongoose.model('Nutrition', nutritionSchema);
