const { test, describe, after, beforeEach, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Trip = require('../models/trip')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

test({ concurrency: false })

before(async () => {
  await User.deleteMany({})
  await Trip.deleteMany({})
})

beforeEach(async () => {
  await User.deleteMany({})
  await Trip.deleteMany({})

  const initialUsers = [
    {
      username: 'TestUser1',
      passwordHash: 'TestPassword'
    },
    {
      username: 'TestUser2',
      passwordHash: 'TestPassword2'
    },
  ]

  let userObject = new User(initialUsers[0])
  await userObject.save()
  userObject = new User(initialUsers[1])
  await userObject.save()
})

describe('getting users', () => {

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns all users', async () => {
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, 2)
  })
})

describe('creating users', () => {

  test('user can be created', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      username: 'NewUser',
      password: 'password123'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const usersAfter = await helper.usersInDb()
    const usernames = usersAfter.map(u => u.username)

    assert.strictEqual(usersBefore.length + 1, usersAfter.length)
    assert(usernames.includes('NewUser'))
  })

  test('user not created if password length not 8-25', async () => {
    const usersBefore = await helper.usersInDb()

    let newUser = {
      username: 'NewUser',
      password: 'passwor'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    newUser = {
      username: 'NewUser',
      password: 'passwordIsTooLongggggggggggggggggggggg'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAfter = await helper.usersInDb()
    assert.strictEqual(usersBefore.length, usersAfter.length)
  })

  test('user not created if username length not 3-20', async () => {
    const usersBefore = await helper.usersInDb()

    let newUser = {
      username: 'Ne',
      password: 'password123'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    newUser = {
      username: 'Newwwwwwwwwwwwwwwwwww',
      password: 'password123'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAfter = await helper.usersInDb()
    assert.strictEqual(usersBefore.length, usersAfter.length)
  })

  test('user not created if username not unique', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      username: 'TestUser1',
      password: 'password123'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAfter = await helper.usersInDb()
    assert.strictEqual(usersBefore.length, usersAfter.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
