import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/users'

const getAll = async () => {
  const request = axios.get(`${baseUrl}`)
  const response = await request
  return response.data
}

const create = async newObject => {
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

const login = async credentials => {
  const response = await axios.post('http://localhost:3003/api/login', credentials)
  return response.data
}

export default { getAll, create, login }