const tripsRouter = require('express').Router()
const Trip = require('../models/trip')

tripsRouter.get('/', async (request, response) => {
  Trip.find({}).then((trips) => {
    response.json(trips)
  })
})

tripsRouter.post('/', (request, response) => {
  const trip = new Trip(request.body)

  trip.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = tripsRouter