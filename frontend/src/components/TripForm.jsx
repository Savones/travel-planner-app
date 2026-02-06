import { useField } from '../hooks'
import { useNavigate } from 'react-router-dom'

const TripForm = ({ addNew }) => {
  const navigate = useNavigate()

  const country = useField('text')
  const startDate = useField('text')
  const endDate = useField('text')

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
      <h2>Add a new trip</h2>
      <form onSubmit={handleSubmit}>
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

export default TripForm