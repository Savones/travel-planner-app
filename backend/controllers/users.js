const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { populate } = require('dotenv')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username) {
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (!password) {
    return response.status(400).json({
      error: 'password missing'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('trips', { title: 1, locations: 1 })

  response.json(users)
})

module.exports = usersRouter