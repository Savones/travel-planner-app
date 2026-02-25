import { useField } from '../hooks'
import { useNavigate } from 'react-router-dom'

const TripForm = ({ user, addNew }) => {
  const navigate = useNavigate()

  const title = useField('text')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const createdTrip = await addNew({
      title: title.value,
      userId: user.id
    })

    navigate(`/trips/${createdTrip.id}`)
  }

  const handleCancellation = (event) => {
    event.preventDefault()
    navigate('/')
  }

  return (
    <div>
      <h2>Add a new trip</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Title
          <input {...title} />
        </div>
        <input type='button' value='Cancel' onClick={handleCancellation} />
        <input type='submit' value='Create' />
      </form>
    </div>
  )
}

export default TripForm