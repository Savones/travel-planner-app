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

locationsRouter.get('/countries/:countryIso/cities', async (request, response) => {
  try {
    const { countryIso } = request.params

    const cities = await axios.get(
      `https://api.countrystatecity.in/v1/countries/${countryIso}/cities`,
      {
        headers: {
          'X-CSCAPI-KEY': process.env.CSC_API_KEY
        }
      }
    )

    response.json(cities.data)

  } catch (error) {
    console.error(error.message)
    response.status(500).json({ error: 'Failed to fetch cities' })
  }
})


module.exports = locationsRouter