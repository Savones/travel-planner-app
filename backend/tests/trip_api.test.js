const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Trip = require('../models/trip')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Trip.deleteMany({})
  await User.deleteMany({})

  testUser = await new User({
    username: 'TestUser',
    passwordHash: 'TestPassword'
  }).save()

  const initialTrips = [
    {
      title: 'First trip',
      user: testUser
    },
    {
      title: 'Second trip',
      user: testUser
    },
  ]

  let tripObject = new Trip(initialTrips[0])
  await tripObject.save()
  tripObject = new Trip(initialTrips[1])
  await tripObject.save()
})

test('trips are returned as json', async () => {
  await api
    .get('/api/trips')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all trips are returned', async () => {
  const response = await api.get('/api/trips')

  assert.strictEqual(response.body.length, 2)
})

test('first trip title found', async () => {
  const response = await api.get('/api/trips')

  const contents = response.body.map(e => e.title)
  assert.strictEqual(contents.includes('First trip'), true)
})

after(async () => {
  await mongoose.connection.close()
})