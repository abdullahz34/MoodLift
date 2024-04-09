// models/message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  recipient: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

//export default mongoose.models.Message || mongoose.model('Message', messageSchema);

const Message =  mongoose.models.Message || mongoose.model("Message", messageSchema)

export default Message;