const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
  country: String,
  city: String,
  notes: String,
  startDate: Date,
  endDate: Date,
  backgroundColor: {
    type: String,
    default: '#ffffff'
  }
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
  locations: [locationSchema],
  budget: {
    amount: Number,
    currency: {
      type: String,
      default: 'EUR'
    }
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})

tripSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

locationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Trip', tripSchema)
