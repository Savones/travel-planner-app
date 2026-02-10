import { useField } from '../hooks'
import { useNavigate } from 'react-router-dom'

const LocationForm = ({ addNew }) => {
  const navigate = useNavigate()

  const title = useField('text')
  const country = useField('text')
  const startDate = useField('date')
  const endDate = useField('date')

  const handleSubmit = (event) => {
    event.preventDefault()
    addNew({
      country: country.value,
      startDate: startDate.value,
      endDate: endDate.value
    })
    navigate('/')
  }

  return (
    <div>
      <h3>Add new location</h3>
      <form onSubmit={handleSubmit}>
        <div>
          Title
          <input {...title} />
        </div>
        <div>
          Country
          <input {...country} />
        </div>
        <div>
          Start date
          <input {...startDate} />
        </div>
        <div>
          End date
          <input {...endDate} />
        </div>
        <input type='submit' value='Create' />
      </form>
    </div>
  )
}

export default LocationForm