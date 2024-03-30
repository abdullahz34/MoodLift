// models/message.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  ambassador: { type: String, required: true },
  user: { type: String, required: true },
  schedule: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Appointments', appointmentSchema);
