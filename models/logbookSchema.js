import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import fitnessSchema from './fitnessSchema.js'; // Import fitness schema
import nutritionSchema from './nutritionSchema.js'; // Import nutrition schema
import hydrationSchema from './hydrationSchema.js'; // Import hydration schema
import sleepSchema from './sleepSchema.js'; // Import sleep schema

const logbookSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  fitness: {
    type: fitnessSchema
  },
  nutrition: {
    type: nutritionSchema
  },
  hydration: {
    type: hydrationSchema
  },
  sleep: {
    type: sleepSchema
  }
});

export default mongoose.models.Logbook || mongoose.model('Logbook', logbookSchema);