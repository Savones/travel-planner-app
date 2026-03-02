import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/trips'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const request = axios.get(`${baseUrl}`)
  const response = await request
  return response.data
}

const deleteTrip = async tripId => {
  await axios.delete(`${baseUrl}/${tripId}`)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async updatedObject => {
  const id = updatedObject.id

  const response = await axios.put(`${baseUrl}/${id}`, updatedObject)
  return response.data
}

export default { getAll, setToken, create, update, deleteTrip }