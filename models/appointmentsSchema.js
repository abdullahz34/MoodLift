// models/message.js
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  ambassador: { type: String, required: true },
  user: { type: String, required: true },
  schedule: { type: Date, default: Date.now },
});

//export default mongoose.models.Appointments || mongoose.model('Appointments', appointmentSchema);
const Appointments =  mongoose.models.Appointments || mongoose.model("Appointments", appointmentSchema)

export default Appointments;