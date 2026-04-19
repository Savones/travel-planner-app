import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useField } from '../hooks'
import { useDispatch } from 'react-redux'
import { editTrip } from '../reducers/tripReducer'
import { useSelector } from 'react-redux'
import { showNotification } from '../reducers/notificationReducer'
import axios from 'axios'

const EditTripForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const title = useField('text')
  const budgetAmount = useField('number')
  const budgetCurrency = useField('text')
  const [imageUrl, setImageUrl] = useState('')

  const trip = useSelector(state =>
    state.trips.find(t => t.id === id)
  )
  const allUsers = useSelector(state => state.users)
  const currentUser = useSelector(state => state.user)

  const [users, setUsers] = useState([])

  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (trip) {
      setUsers(trip.users)
      title.setValue(trip.title)
      budgetAmount.setValue(trip.budget.amount)
      budgetCurrency.setValue(trip.budget.currency)
      setImageUrl(trip.imageUrl)
    }
  }, [trip])

  if (!trip) {
    return <p>Loading trip...</p>
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const updatedTrip = {
      ...trip,
      title: title.value,
      budget: { amount: budgetAmount.value, currency: budgetCurrency.value },
      users,
      imageUrl
    }

    try {
      dispatch(editTrip(updatedTrip))
      dispatch(showNotification(`Edited trip "${trip.title}" successfully`, 5000, 'success'))
      navigate(`/trips/${trip.id}`)
    } catch (error) {
      dispatch(showNotification(`Failed to edit trip "${trip.title}"`, 5000, 'error'))
    }
  }

  const cancel = (event) => {
    event.preventDefault()
    navigate(`/trips/${trip.id}`)
  }

  const handleRemoveTraveller = (userId) => {
    const updatedUsers = users.filter(u => u.user.id !== userId)
    setUsers(updatedUsers)
  }

  const handleAddTraveller = (user) => {
    setUsers([...users, { user, role: 'reader' }])
    setShowDropdown(false)
  }

  const handleRoleChange = (userId, role) => {
    setUsers(users.map(u => u.user.id === userId ? { ...u, role } : u))
  }

  const availableUsers = allUsers.filter(u =>
    u.id !== currentUser?.id &&
    !users.some(selected => selected.user.id === u.id)
  )

  const handleUpload = async (event) => {
    try {
      const file = event.target.files[0]
      const formData = new FormData()
      formData.append('image', file)
      const response = await axios.post('/api/upload', formData)
      console.log(response.data)
      setImageUrl(response.data.url)

    } catch (error) {
      console.error('upload error:', error)
    }
  }

  return (
    <form className='editTripForm' onSubmit={handleSubmit}>
      <h2>Edit trip details</h2>
      <div className='editOuterSection'>
        <div className='editSection'>
          <div className='editRow'>
            <label>Title</label>
            <input
              type={title.type}
              value={title.value}
              onChange={title.onChange}
            />
          </div>
        </div>
      </div>

      <div className='editOuterSection'>
        <h3>Background image</h3>
        <div className='editSection'>
          <label className="fileUpload">
            Upload image
            <input
              type="file"
              onChange={handleUpload}
              style={{ display: 'none' }}
            />
          </label>
          {imageUrl && <img src={imageUrl} className='backgroundImgPreview' />}
        </div>
      </div>

      {trip.user.username === currentUser.username && (
        <div className='editOuterSection'>
          <h3>Travellers</h3>
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Add traveller
          </button>

          {showDropdown && (
            <div className="dropdown">
              {availableUsers.map(user => (
                <div
                  key={user.id}
                  className="dropdownItem"
                  onClick={() => handleAddTraveller(user)}
                >
                  {user.username}
                </div>
              ))}
            </div>
          )}

          <div className='editSection'>

            <div className='editRow'>
              <span className='travellerName'>{trip.user.username}</span>
              Owner
            </div>
            {users.map(u => (
              <div className="editRow" key={u.user.id}>
                <span className="travellerName">
                  {u.user.username}
                </span>

                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.user.id, e.target.value)}
                >
                  <option value="reader">Reader</option>
                  <option value="editor">Editor</option>
                </select>

                <button
                  className='cancelButton'
                  type="button"
                  onClick={() => handleRemoveTraveller(u.user.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='editOuterSection'>
        <h3>Budget</h3>
        <div className='editSection'>
          <div className='editRow'>
            <label>Total budget</label>
            <input
              type={budgetAmount.type}
              value={budgetAmount.value ?? 0}
              onChange={budgetAmount.onChange}
            />
            <select
              value={budgetCurrency.value ?? 'EUR'}
              onChange={budgetCurrency.onChange}
            >
              <option value="EUR">€ EUR</option>
              <option value="USD">$ USD</option>
              <option value="GBP">£ GBP</option>
              <option value="JPY">¥ JPY</option>
            </select>
          </div>
        </div>
      </div>

      <div className='editRow'>
        <button type="submit">Save</button>
        <button className='cancelButton' onClick={cancel}>Cancel</button>
      </div>
    </form>
  )
}

export default EditTripForm
