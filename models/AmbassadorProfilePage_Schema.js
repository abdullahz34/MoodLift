const mongoose = require('mongoose');;

const ambassadorProfilePageSchema = new mongoose.Schema({

    username: {
        type:String,
        required: true
    },

    name: {
        type:String,
        required: true
    },

    gender: {
        type:String,
        required:true
    },

    age: {
        type:String,
        required: true
    },

    description: {
        type:String,
        required: true
    }
},{timestamps:true});

const Ambassador_Profile_Page = mongoose.models.Ambassador_Profile_Page || mongoose.model('Ambassador_Profile_Page', ambassadorProfilePageSchema);

module.exports = Ambassador_Profile_Page;