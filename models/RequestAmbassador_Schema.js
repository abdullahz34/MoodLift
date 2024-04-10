const mongoose = require('mongoose');;

const RequestAmbassadorSchema = new mongoose.Schema({

    Ambassador_username: {
        type:String,
        required: true
    },

    Employee_username: {
        type:String,
        required: true
    },

    Severity:{
        type:String,
        required:true
    },
    Reason: {
        type:String,
        required:true
    },

    Appointment_Preference: {
        type:String,
        required: true
    },

},{timestamps:true});

module.exports = mongoose.models.Requests || mongoose.model('Requests', RequestAmbassadorSchema);

