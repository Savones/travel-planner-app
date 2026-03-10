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

const getById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const deleteTrip = async tripId => {
  const config = {
    headers: { Authorization: token }
  }
  await axios.delete(`${baseUrl}/${tripId}`, config)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async updatedObject => {
  const config = {
    headers: { Authorization: token }
  }
  const id = updatedObject.id

  const response = await axios.put(`${baseUrl}/${id}`, updatedObject, config)
  return response.data
}

export default { getAll, setToken, create, update, deleteTrip, getById }