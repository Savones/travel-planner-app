import { useField } from '../hooks'
import { useNavigate } from 'react-router-dom'

const TripForm = ({ addNew }) => {
  const navigate = useNavigate()

  const title = useField('text')

  const handleSubmit = (event) => {
    event.preventDefault()
    const id = Math.round(Math.random() * 10000)
    addNew({
      title: title.value,
      id: id
    })
    navigate(`/trips/${id}`)
  }

  return (
    <div>
      <h2>Add a new trip</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Title
          <input {...title} />
        </div>
        <input type='submit' value='Create' />
      </form>
    </div>
  )
}

export default TripForm