const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const tripsRouter = require('./controllers/trips')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const locationsRouter = require('./controllers/locations')
const uploadRouter = require('./controllers/upload')

const app = express()
app.use(cors())

mongoose.connect(config.MONGODB_URI, { family: 4 })

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.use('/api/trips', tripsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/locations', locationsRouter)
app.use('/api/upload', uploadRouter)

const path = require('path')

app.use(express.static('dist'))

app.get('*id', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app