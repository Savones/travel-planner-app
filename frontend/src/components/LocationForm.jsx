import { useField } from '../hooks'
import { useNavigate } from 'react-router-dom'

const LocationForm = ({ addNew }) => {
  const navigate = useNavigate()

  const location = useField('text')
  const startDate = useField('date')
  const endDate = useField('date')

  const handleSubmit = (event) => {
    event.preventDefault()
    const location_id = Math.round(Math.random() * 10000)
    addNew({
      location_id: location_id,
      location: location.value,
      startDate: startDate.value,
      endDate: endDate.value
    })
    navigate(`/`)
  }

  return (
    <div>
      <h3>Add new location</h3>
      <form onSubmit={handleSubmit}>
        <div>
          Location
          <input {...location} />
        </div>
        <div>
          Start date
          <input {...startDate} />
        </div>
        <div>
          End date
          <input {...endDate} />
        </div>
        <input type='submit' value='Add' />
      </form>
    </div>
  )
}

export default LocationForm