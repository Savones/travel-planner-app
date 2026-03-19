import { useField } from '../hooks'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const TripForm = ({ addNew }) => {
  const user = useSelector(state => state.user)
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