const locationsRouter = require('express').Router()
const axios = require('axios')

const config = {
  headers: {
    'X-CSCAPI-KEY': process.env.CSC_API_KEY
  }
}

locationsRouter.get('/countries', async (request, response) => {
  const countries = await axios.get(
    'https://api.countrystatecity.in/v1/countries',
    config
  )
  response.json(countries.data)
})

locationsRouter.get('/countries/:countryIso/states', async (request, response) => {
  const { countryIso } = request.params

  const states = await axios.get(
    `https://api.countrystatecity.in/v1/countries/${countryIso}/states`,
    config
  )

  response.json(states.data)
})

locationsRouter.get('/countries/:countryIso/states/:stateIso/cities', async (request, response) => {
  const { countryIso, stateIso } = request.params

  const cities = await axios.get(
    `https://api.countrystatecity.in/v1/countries/${countryIso}/states/${stateIso}/cities`,
    config
  )

  response.json(cities.data)
})

module.exports = locationsRouter