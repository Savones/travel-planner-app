const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Trip = require('../models/trip')

const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const tripsInDb = async () => {
  const trips = await Trip.find({})
  return trips.map(trip => trip.toJSON())
}

const createToken = (user) =>
  jwt.sign({ username: user.username, id: user._id }, process.env.SECRET)

const createUser = async (username = 'testuser') => {
  return await new User({
    username,
    passwordHash: 'password'
  }).save()
}
module.exports = { createToken, tripsInDb, createUser }