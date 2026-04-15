const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, password } = request.body

    if (!username) {
      return response.status(400).json({
        error: 'name missing'
      })
    } else if (!password) {
      return response.status(400).json({
        error: 'password missing'
      })
    } else if (password.length < 8 || password.length > 25) {
      return response.status(400).json({
        error: 'password has to have 8-25 characters'
      })
    } else if (username.length < 3 || username.length > 20) {
      return response.status(400).json({
        error: 'username has to have 3-20 characters'
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

  } catch (error) {
    next(error)
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})

  response.json(users)
})

module.exports = usersRouter