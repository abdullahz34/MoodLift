import mongoose from "mongoose";

const {Schema}= mongoose;

const AppointmentSchema=new Schema({
    AmbassadorID: {
        type:String,
        required: true
    },

    EmployeeID: {
        type:String,
        required: true
    },

    Date: {
        type:String,
        required: true
    },

    Time: {
        type:String,
        required: true
    }
},{timestamps:true});

export default mongoose.models.Appointment ||  mongoose.model("Appointment", AppointmentSchema);