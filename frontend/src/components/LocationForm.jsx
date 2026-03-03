import LocationDropdown from './LocationDropdown'
import { useField } from '../hooks'

const LocationForm = ({ addNew, handleCancel }) => {

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
  }

  return (
    <div>
      <h3>Add new location</h3>
      <form onSubmit={handleSubmit}>
        <LocationDropdown />
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
        <input type='button' value='Cancel' onClick={handleCancel} />
        <input type='submit' value='Add' />
      </form>
    </div>
  )
}

export default LocationForm