import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const journalSchema = new Schema({
  username: { type: String, required: true },
  date: { type: Date, required: true },
  entry: { type: String, required: true },
});

export default mongoose.models.Journal || mongoose.model('Journal', journalSchema);