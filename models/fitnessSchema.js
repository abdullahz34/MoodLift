import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const fitnessSchema = new Schema({
  exercise: {
    type: String,
    required: true
  },
  sets: {
    type: Number
  },
  reps: {
    type: Number
  },
  duration: {
    type: Number
  }
});

module.exports = fitnessSchema;