import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const sleepSchema = new Schema({
  duration: {
    type: Number,
    required: true
  },
  quality: {
    type: String,
    enum: ['good', 'fair', 'poor']
  }
});

module.exports = sleepSchema;
