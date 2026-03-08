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
    <div className='createTripDiv'>
      <h2>Add a new trip</h2>
      <form className='createTripForm' onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input {...title} />
        </div>
        <div className='createButtonsDiv'>
          <input type='submit' value='Create' />
          <input type='button' value='Cancel' onClick={handleCancellation} />
        </div>
      </form>
    </div>
  )
}

export default TripForm