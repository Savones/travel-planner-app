import axios from 'axios'
const baseUrl = '/api/upload'

const upload = async formData => {
  const response = await axios.post(baseUrl, formData)
  return response.data
}

export default { upload }