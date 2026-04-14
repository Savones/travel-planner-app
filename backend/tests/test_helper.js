const jwt = require('jsonwebtoken')

const createToken = (user) =>
  jwt.sign({ username: user.username, id: user._id }, process.env.SECRET)

module.exports = { createToken }