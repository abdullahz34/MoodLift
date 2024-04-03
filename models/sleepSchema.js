import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const sleepSchema = new Schema({
  hoursSlept: {
    type: Number,
    required: true
  },
  sleepQuality: {
    type: String,
    enum: ['good', 'fair', 'poor']
  }
});

module.exports = sleepSchema;

