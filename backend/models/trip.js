const mongoose = require('mongoose')

const tripSchema = mongoose.Schema({
  title: String,
  location: Array,
  user:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

tripSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Trip', tripSchema)