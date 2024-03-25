const express = require('express')
const {
  createUser,
  getUsers,
  getUser,
  deleteUser,
  updateUser
} = require('../controllers/userController')

const router = express.Router()

//GET all users
router.get('/', getUsers)

//GET a single user
router.get('/:username', getUser)

//POST a new user
router.post('/', createUser)

//DELETE a user
router.delete('/:id', deleteUser)

//UPDATE a user
router.patch('/:id', updateUser)

module.exports = router