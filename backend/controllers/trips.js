const tripsRouter = require('express').Router()
const Trip = require('../models/trip')
const User = require('../models/user')
const { populate } = require('dotenv')

tripsRouter.get('/', async (request, response) => {
  Trip.find({})
    .populate('user', { username: 1 })
    .then((trips) => {
      response.json(trips)
    })
})

tripsRouter.post('/', async (request, response) => {
  const { title, userId } = request.body

  const user = await User.findById(userId)

  if (!user) {
    return response.status(400).json({ error: 'invalid user' })
  }

  const trip = new Trip({
    title,
    user: user._id
  })

  const savedTrip = await trip.save()

  user.trips = user.trips.concat(savedTrip._id)
  await user.save()

  response.status(201).json(savedTrip)
})


module.exports = tripsRouter