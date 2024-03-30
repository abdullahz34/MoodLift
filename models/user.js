// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isEmployee: { type: Boolean, default: false },
  isAmbassador: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  // Add any other fields you might need
});

module.exports = mongoose.model('User', userSchema);
