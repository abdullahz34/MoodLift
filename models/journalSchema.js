import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const journalSchema = new Schema({
  username: { type: String, required: true },
  date: { type: Date, required: true },
  entry: { type: String, required: true },
  mood: { type: String, default: '' }, 
  streak: { type: Number, default: 0 },
});

export default mongoose.models.Journal || mongoose.model('Journal', journalSchema);