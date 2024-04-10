import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const goalSchema = new Schema({
  username: { type: String, required: true },
  goal_type: { type: String, required: true },
  value: { type: Number, required: true },
});

export default mongoose.models.Goal || mongoose.model('Goal', goalSchema);