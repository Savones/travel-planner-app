import { useField } from '../hooks'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addNewTrip } from '../reducers/tripReducer'
import { showNotification } from '../reducers/notificationReducer'

const TripForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const title = useField('text')
  const { setValue, ...titleInput } = title
  const user = useSelector(state => state.user)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!title.value.trim()) {
      dispatch(showNotification('Title is required.', 5000, 'info'))
      return
    }

    if (title.value.length > 20) {
      dispatch(showNotification('Title can have maximum 20 characters.', 5000, 'info'))
      return
    }

    try {
      const createdTrip = {
        title: title.value,
        userId: user.id
      }

      const returnedTrip = await dispatch(addNewTrip(createdTrip))
      dispatch(showNotification(`Created trip "${returnedTrip.title}"`, 5000, 'success'))
      navigate(`/trips/${returnedTrip.id}`)
    } catch {
      dispatch(showNotification(`Something went wrong.`, 5000, 'error'))
    }
  }

  const handleCancellation = (event) => {
    event.preventDefault()
    navigate('/')
  }

  return (
    <div className='editOuterSection'>
      <h2>Create a new trip</h2>
      <form>
        <div className='editSection'>
          <div className='editRow'>
            <label>Title</label>
            <input {...titleInput} />
          </div>
        </div>
        <div className='editRow'>
          <button onClick={handleSubmit}>Create</button>
          <button onClick={handleCancellation} className='cancelButton'>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default TripForm