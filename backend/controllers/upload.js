const upload = require('../utils/cloudinary')
const uploadRouter = require('express').Router()

uploadRouter.post('/', (request, response) => {
  upload.single('image')(request, response, function (error) {
    if (error) {
      return response.status(400).json({ error: error.message })
    }

    if (!request.file) {
      return response.status(400).json({ error: 'No file uploaded' })
    }

    response.json({ url: request.file.path })
  })
})

module.exports = uploadRouter