import { useField } from '../hooks'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addNewTrip } from '../reducers/tripReducer'

const TripForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(state => state.user)
  const title = useField('text')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const createdTrip = {
      title: title.value,
      userId: user.id
    }

    const returnedTrip = await dispatch(addNewTrip(createdTrip))
    navigate(`/trips/${returnedTrip.id}`)
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