import mongoose, { now } from "mongoose";

const {Schema}= mongoose;

const appointmentSchema=new Schema({

    Ambassador_username: {
        type:String,
        required: true
    },

    Employee_username: {
        type:String,
        required: true
    },

    Date_Time: {
        type:Date,
        default: Date(now),
        required:true
    },

    JustDate: {
        type:String,
        required: true
    },

    Appointment_form: {
        type:String,
        default: "In person",
        required: true
    }
},{timestamps:true});

const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

export default Appointment;