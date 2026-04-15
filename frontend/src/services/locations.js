import axios from 'axios'

const baseUrl = '/api/locations'

const getCountries = async () => {
  const response = await axios.get(`${baseUrl}/countries`)
  return response.data
}

const getCities = async (countryIso) => {
  const response = await axios.get(`${baseUrl}/countries/${countryIso}/cities`)
  return response.data
}

export default { getCountries, getCities }
