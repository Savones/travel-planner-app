const { test, after, beforeEach } = require('node:test')
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

test('trip can be created', async () => {
  testUser2 = await new User({
    username: 'TestUse2r',
    passwordHash: 'TestPassword2'
  }).save()

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

  const response = await api.get('/api/trips')
  const titles = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, 3)
  assert(titles.includes('New trip'))
})

test('trip can not be created without valid token ', async () => {
  testUser2 = await new User({
    username: 'TestUse2r',
    passwordHash: 'TestPassword2'
  }).save()

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

  const response = await api.get('/api/trips')
  const titles = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, 2)
  assert(!titles.includes('New trip'))
})

test('trip can be deleted by owner', async () => {
  testUser2 = await new User({
    username: 'TestUse2r',
    passwordHash: 'TestPassword2'
  }).save()

  const trip = await new Trip({
    title: 'Delete this',
    user: testUser2._id
  }).save()

  const token = jwt.sign(
    { username: testUser2.username, id: testUser2._id },
    process.env.SECRET
  )

  await api
    .delete(`/api/trips/${trip.id}`)
    .set('Authorization', `Bearer ${token}`)

  const response = await api.get('/api/trips')
  const titles = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, 2)
  assert(!titles.includes('Delete this'))
})

test('trip can be updated by owner', async () => {
  testUser2 = await new User({
    username: 'TestUse2r',
    passwordHash: 'TestPassword2'
  }).save()

  const trip = await new Trip({
    title: 'Update this',
    user: testUser2._id
  }).save()

  const token = jwt.sign(
    { username: testUser2.username, id: testUser2._id },
    process.env.SECRET
  )

  const updatedTrip = {
    title: 'Updated trip'
  }

  await api
    .put(`/api/trips/${trip.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedTrip)
    .expect(200)

  const response = await api.get('/api/trips')
  const titles = response.body.map(r => r.title)

  assert(titles.includes('Updated trip'))
  assert(!titles.includes('Update this'))
})

test('trip can be updated by editor', async () => {
  testUser2 = await new User({
    username: 'TestUser2',
    passwordHash: 'TestPassword2'
  }).save()

  testUser3 = await new User({
    username: 'TestUser3',
    passwordHash: 'TestPassword3'
  }).save()

  const trip = await new Trip({
    title: 'Update this',
    user: testUser2._id,
    users: [{ user: testUser3._id, role: 'editor' }]
  }).save()

  const token = jwt.sign(
    { username: testUser3.username, id: testUser3._id },
    process.env.SECRET
  )

  const updatedTrip = {
    title: 'Updated trip'
  }

  await api
    .put(`/api/trips/${trip.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedTrip)
    .expect(200)

  const response = await api.get('/api/trips')
  const titles = response.body.map(r => r.title)

  assert(titles.includes('Updated trip'))
  assert(!titles.includes('Update this'))
})

test.only('trip can not be updated by reader', async () => {
  testUser2 = await new User({
    username: 'TestUser2',
    passwordHash: 'TestPassword2'
  }).save()

  testUser3 = await new User({
    username: 'TestUser3',
    passwordHash: 'TestPassword3'
  }).save()

  const trip = await new Trip({
    title: 'Update this',
    user: testUser2._id,
    users: [{ user: testUser3._id, role: 'reader' }]
  }).save()

  const token = jwt.sign(
    { username: testUser3.username, id: testUser3._id },
    process.env.SECRET
  )

  const updatedTrip = {
    title: 'Updated trip'
  }

  await api
    .put(`/api/trips/${trip.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedTrip)
    .expect(403)

  const response = await api.get('/api/trips')
  const titles = response.body.map(r => r.title)

  assert(!titles.includes('Updated trip'))
  assert(titles.includes('Update this'))
})

after(async () => {
  await mongoose.connection.close()
})