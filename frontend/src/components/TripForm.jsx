import { useField } from '../hooks'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addNewTrip } from '../reducers/tripReducer'
import { showNotification } from '../reducers/notificationReducer'

const TripForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(state => state.user)
  const title = useField('text')
  const { setValue, ...titleInput } = title

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!title.value.trim()) {
      dispatch(showNotification('Title is required.', 5000))
      return
    }

    if (title.value.length > 20) {
      dispatch(showNotification('Title can have maximum 20 characters.', 5000))
      return
    }

    try {
      const createdTrip = {
        title: title.value,
        userId: user.id
      }

      const returnedTrip = await dispatch(addNewTrip(createdTrip))
      dispatch(showNotification(`Created trip "${returnedTrip.title}"`, 5000))
      navigate(`/trips/${returnedTrip.id}`)
    } catch {
      dispatch(showNotification(`Something went wrong.`, 5000))
    }
  }

  const handleCancellation = (event) => {
    event.preventDefault()
    navigate('/')
  }

  return (
    <div className='createTripDiv'>
      <h2>Create a trip</h2>
      <form className='createTripForm' onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input {...titleInput} />
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