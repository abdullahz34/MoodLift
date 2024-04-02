import mongoose from "mongoose";
// const bcrypt = require('bcrypt')
// const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isEmployee: { type: Boolean, default: false },
  isAmbassador: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  password: { type: String, required: true },
  type: { type: String, required: true },
}, {timestamps: true})

const User =  mongoose.models.User || mongoose.model("User", userSchema)

export default User;