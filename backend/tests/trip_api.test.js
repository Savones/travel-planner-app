const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Trip = require('../models/trip')
const User = require('../models/user')
const helper = require('./test_helper')

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

describe('getting trips', () => {

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

    const titles = response.body.map(e => e.title)
    assert.strictEqual(titles.includes('First trip'), true)
  })
})
describe('creating trips', () => {

  test('trip can be created', async () => {
    const tripsBefore = await helper.tripsInDb()

    testUser2 = await helper.createUser('user2')
    const token = helper.createToken(testUser2)

    const newTrip = {
      title: 'New trip',
      user: testUser2
    }
    await api
      .post('/api/trips')
      .set('Authorization', `Bearer ${token}`)
      .send(newTrip)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const tripsAfter = await helper.tripsInDb()
    const titles = tripsAfter.map(r => r.title)

    assert.strictEqual(tripsBefore.length + 1, tripsAfter.length)
    assert(titles.includes('New trip'))
  })

  test('trip can not be created without valid token ', async () => {
    const tripsBefore = await helper.tripsInDb()

    testUser2 = await helper.createUser('user2')
    const token = 'nonValidToken'

    const newTrip = {
      title: 'New trip',
      user: testUser2
    }

    await api
      .post('/api/trips')
      .set('Authorization', `Bearer ${token}`)
      .send(newTrip)
      .expect(401)

    const tripsAfter = await helper.tripsInDb()
    const titles = tripsAfter.map(r => r.title)

    assert.strictEqual(tripsBefore.length, tripsAfter.length)
    assert(!titles.includes('New trip'))
  })
})

describe('deleting trips', () => {

  test('trip can be deleted by owner', async () => {
    testUser2 = await helper.createUser('user2')
    const token = helper.createToken(testUser2)

    const trip = await new Trip({
      title: 'Delete this',
      user: testUser2._id
    }).save()

    const tripsBefore = await helper.tripsInDb()

    await api
      .delete(`/api/trips/${trip.id}`)
      .set('Authorization', `Bearer ${token}`)

    const tripsAfter = await helper.tripsInDb()
    const titles = tripsAfter.map(r => r.title)

    assert.strictEqual(tripsAfter.length, tripsBefore.length - 1)
    assert(!titles.includes('Delete this'))
  })
})

describe('updating trips', () => {

  test('trip can be updated by owner', async () => {
    testUser2 = await helper.createUser('user2')

    const trip = await new Trip({
      title: 'Update this',
      user: testUser2._id
    }).save()

    const token = helper.createToken(testUser2)

    const updatedTrip = {
      title: 'Updated trip'
    }

    await api
      .put(`/api/trips/${trip.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedTrip)
      .expect(200)

    const trips = await helper.tripsInDb()
    const titles = trips.map(r => r.title)

    assert(titles.includes('Updated trip'))
    assert(!titles.includes('Update this'))
  })

  test('trip can be updated by editor', async () => {
    testUser2 = await helper.createUser('user2')
    testUser3 = await helper.createUser('user3')

    const trip = await new Trip({
      title: 'Update this',
      user: testUser2._id,
      users: [{ user: testUser3._id, role: 'editor' }]
    }).save()

    const token = helper.createToken(testUser2)

    const updatedTrip = {
      title: 'Updated trip'
    }

    await api
      .put(`/api/trips/${trip.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedTrip)
      .expect(200)

    const trips = await helper.tripsInDb()
    const titles = trips.map(r => r.title)

    assert(titles.includes('Updated trip'))
    assert(!titles.includes('Update this'))
  })

  test.only('trip can not be updated by reader', async () => {
    testUser2 = await helper.createUser('user2')
    testUser3 = await helper.createUser('user3')

    const trip = await new Trip({
      title: 'Update this',
      user: testUser2._id,
      users: [{ user: testUser3._id, role: 'reader' }]
    }).save()

    const token = helper.createToken(testUser3)

    const updatedTrip = {
      title: 'Updated trip'
    }

    await api
      .put(`/api/trips/${trip.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedTrip)
      .expect(403)

    const trips = await helper.tripsInDb()
    const titles = trips.map(r => r.title)

    assert(!titles.includes('Updated trip'))
    assert(titles.includes('Update this'))
  })
})

after(async () => {
  await mongoose.connection.close()
})