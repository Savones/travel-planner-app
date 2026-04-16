import LocationDropdown from './LocationDropdown'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useField } from '../hooks'
import locationService from '../services/locations'
import { useDispatch } from 'react-redux'
import { editTrip } from '../reducers/tripReducer'
import { useSelector } from 'react-redux'
import { showNotification } from '../reducers/notificationReducer'

const EditTripForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const title = useField('text')
  const budgetAmount = useField('number')
  const budgetCurrency = useField('text')

  const trip = useSelector(state =>
    state.trips.find(t => t.id === id)
  )
  const allUsers = useSelector(state => state.users)
  const currentUser = useSelector(state => state.user)

  const [users, setUsers] = useState([])
  const [locations, setLocations] = useState([])
  const [countries, setCountries] = useState([])

  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (trip) {
      setUsers(trip.users)
    }
  }, [trip])

  useEffect(() => {
    locationService.getCountries().then(setCountries)
  }, [])

  useEffect(() => {
    if (trip && countries.length) {
      const initialLocations = trip.locations.map((location) => {
        const country = countries.find(c => c.name === location.country) || null
        return {
          ...location,
          selectedCountry: country,
          selectedCity: location.city || '',
          cities: []
        }
      })
      setLocations(initialLocations)
      title.setValue(trip.title)
      budgetAmount.setValue(trip.budget.amount)
      budgetCurrency.setValue(trip.budget.currency)
    }
  }, [trip, countries])

  useEffect(() => {
    locations.forEach((location, locationIndex) => {
      if (location.selectedCountry && location.cities.length === 0) {
        locationService.getCities(location.selectedCountry.iso2).then(cities => {
          setLocations(previousLocations => {
            const newLocations = [...previousLocations]
            newLocations[locationIndex].cities = cities
            return newLocations
          })
        })
      }
    })
  }, [locations.map(location => location.selectedCountry?.iso2).join()])

  if (!trip) {
    return <p>Loading trip...</p>
  }

  const handleAddLocation = (event) => {
    event.preventDefault()
    navigate(`/trips/${trip.id}/addLocation`)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const updatedLocations = locations.map(location => ({
      ...location,
      country: location.selectedCountry?.name,
      city: location.selectedCity
    }))

    const updatedTrip = {
      ...trip,
      title: title.value,
      budget: { amount: budgetAmount.value, currency: budgetCurrency.value },
      locations: updatedLocations,
      users
    }

    try {
      dispatch(editTrip(updatedTrip))
      dispatch(showNotification(`Edited trip "${trip.title}" successfully`, 5000))
      navigate(`/trips/${trip.id}`)
    } catch (error) {
      dispatch(showNotification(`Failed to edit trip "${trip.title}"`, 5000))
    }
  }

  const cancel = (event) => {
    event.preventDefault()
    navigate(`/trips/${trip.id}`)
  }

  const handleDeleteLocation = async (location) => {
    const locationId = location.id
    const updatedTrip = {
      ...trip,
      locations: trip.locations.filter(
        location => location.id !== locationId
      )
    }

    const confirmation = window.confirm(`Delete trip "${location.city}"?`)
    if (!confirmation) {
      return
    }

    try {
      await dispatch(editTrip(updatedTrip))
      dispatch(showNotification(`Deleted location "${location.city}" successfully`, 5000))
      navigate(`/trips/${trip.id}`)
    } catch (error) {
      dispatch(showNotification(`Failed to delete "${location.city}."`, 5000))

    }
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

  return (
    <form className='editTripForm' onSubmit={handleSubmit}>
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
              value={budgetAmount.value}
              onChange={budgetAmount.onChange}
            />
            <select
              value={budgetCurrency.value}
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

      <div className='editOuterSection'>
        <h3>Locations</h3>
        <button onClick={handleAddLocation}>Add location</button>
        {locations.map((location, locationIndex) => (
          <div className='editSection' key={location.id}>
            <LocationDropdown
              selectedCountry={location.selectedCountry}
              setSelectedCountry={(country) => {
                const newLocations = [...locations]
                newLocations[locationIndex].selectedCountry = country
                newLocations[locationIndex].selectedCity = ''
                newLocations[locationIndex].cities = []
                setLocations(newLocations)
              }}
              selectedCity={location.selectedCity}
              setSelectedCity={(city) => {
                const newLocations = [...locations]
                newLocations[locationIndex].selectedCity = city
                setLocations(newLocations)
              }}
              countries={countries}
              cities={location.cities}
            />

            <div className='editRow'>
              <label>Notes</label>
              <input
                value={location.notes || ''}
                onChange={(event) => {
                  const newLocations = [...locations]
                  newLocations[locationIndex].notes = event.target.value
                  setLocations(newLocations)
                }}
              />
            </div>
            <div className='editRow'>
              <label>Start Date</label>
              <input
                type="date"
                value={location.startDate.substring(0, 10)}
                onChange={(event) => {
                  const newLocations = [...locations]
                  newLocations[locationIndex].startDate = event.target.value
                  setLocations(newLocations)
                }}
              />
            </div>
            <div className='editRow'>
              <label>End Date</label>
              <input
                type="date"
                value={location.endDate.substring(0, 10)}
                onChange={(event) => {
                  const newLocations = [...locations]
                  newLocations[locationIndex].endDate = event.target.value
                  setLocations(newLocations)
                }}
              />
            </div>
            <div className='editRow'>
              <label>Background color</label>
              <input
                type='color'
                value={location.backgroundColor || '#ffffff'}
                onChange={(event) => {
                  const newLocations = [...locations]
                  newLocations[locationIndex].backgroundColor = event.target.value
                  setLocations(newLocations)
                }}
              />
            </div>
            <div className='editRow'>
              <button type='button' onClick={() => handleDeleteLocation(location)}>
                Delete location
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className='editRow'>
        <button type="submit">Save</button>
        <button onClick={cancel}>Cancel</button>
      </div>
    </form>
  )
}

export default EditTripForm
