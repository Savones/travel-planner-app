const tripsRouter = require('express').Router()
const Trip = require('../models/trip')

tripsRouter.get('/', async (request, response) => {
  const trips = await Trip.find({}).populate('user', { username: 1, name: 1 })
  response.json(trips)
})

module.exports = tripsRouter