import axios from 'axios'
const baseUrl = 'http://localhost:3001/trips'

const getAll = async () => {
  const request = axios.get(`${baseUrl}`)
  const response = await request
  return response.data
}

const create = async newObject => {
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

const update = async updatedObject => {
  const id = updatedObject.id

  const response = await axios.put(`${baseUrl}/${id}`, updatedObject)
  return response.data
}

export default { getAll, create, update }