const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
  country: String,
  city: String,
  location: String,
  startDate: Date,
  endDate: Date
})

const tripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  locations: [locationSchema]
})

tripSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Trip', tripSchema)
