const tripsRouter = require('express').Router()
const Trip = require('../models/trip')
const User = require('../models/user')
const { populate } = require('dotenv')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

tripsRouter.get('/', async (request, response) => {
  Trip.find({})
    .populate('user', { username: 1 })
    .then((trips) => {
      response.json(trips)
    })
})

tripsRouter.post('/', async (request, response) => {
  const { title } = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

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

  const populatedTrip = await Trip
    .findById(savedTrip._id)
    .populate('user', { username: 1 })

  response.status(201).json(populatedTrip)
})


tripsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const trip = await Trip.findById(request.params.id)

  trip.title = body.title
  trip.locations = body.locations
  trip.budget = body.budget

  const savedTrip = await trip.save()

  const populatedResult = await Trip
    .findById(savedTrip._id)
    .populate('user', { username: 1 })

  response.json(populatedResult)
})

tripsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const trip = await Trip.findById(request.params.id)
  await trip.deleteOne()

  response.status(204).end()
})

module.exports = tripsRouter