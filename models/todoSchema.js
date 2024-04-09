import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const todoSchema = new Schema({
  username: { type: String, required: true },
  date: { type: Date, required: true },
  tasks: [taskSchema],
});

export default mongoose.models.Todo || mongoose.model('Todo', todoSchema);