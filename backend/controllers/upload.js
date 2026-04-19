const upload = require('../utils/cloudinary')
const uploadRouter = require('express').Router()

uploadRouter.post('/', upload.single('image'), (request, response) => {
  response.json({ url: request.file.path })
})

module.exports = uploadRouter