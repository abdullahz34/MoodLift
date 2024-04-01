const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
// const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
}, {timestamps: true})

const User =  mongoose.models.User || mongoose.model("User", userSchema)

export default User;