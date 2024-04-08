import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const todoSchema = new Schema({
  username: { type: String, required: true },
  date: { type: Date, required: true },
  tasks: [{ type: String, required: true }],
});

export default mongoose.models.Todo || mongoose.model('Todo', todoSchema);