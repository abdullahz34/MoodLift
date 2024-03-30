const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

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
})

//static signup method
userSchema.statics.signup = async function(username, password, type) {

  //validation
  if (!username || !password || !type) {
    throw Error('all fields must be filled')
  }

//  for if we decide username should be email
//  if (!validator.isEmail(username)) {
//    throw Error('email is not valid')
//  }

  if (!validator.isStrongPassword(password)) {
    throw Error('password not strong enough')
  }

  const exists = await this.findOne({ username })

  if (exists) {
    throw Error('username already in use')
  }

  //encrypt password
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({username, password: hash, type})

  return user
}

//static login method
userSchema.statics.login = async function(username, password) {
  if (!username || !password) {
    throw Error('all fields must be filled')
  }

  const user = await this.findOne({username})

  if (!user) {
    throw Error('invalid username')
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    throw Error('invalid password')
  }

  return user
}

module.exports = mongoose.model('User', userSchema)