import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { editTrip } from '../reducers/tripReducer'
import locationService from '../services/locations'
import LocationDropdown from './LocationDropdown'
import { showNotification } from '../reducers/notificationReducer'

const LocationEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const trip = useSelector(state =>
    state.trips.find(t => t.id === id)
  )

  const [locations, setLocations] = useState([])
  const [countries, setCountries] = useState([])

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

  const handleSubmit = async (event) => {
    event.preventDefault()

    const updatedLocations = locations.map(location => ({
      ...location,
      country: location.selectedCountry?.name,
      city: location.selectedCity
    }))

    const updatedTrip = {
      ...trip,
      locations: updatedLocations
    }

    try {
      await dispatch(editTrip(updatedTrip))
      dispatch(showNotification(`Edited locations successfully`, 5000, 'success'))
      navigate(`/trips/${trip.id}`)
    } catch (error) {
      dispatch(showNotification(`Failed to edit locations`, 5000, 'error'))
    }
  }

  const handleDeleteLocation = async (location) => {
    const locationId = location.id

    const updatedTrip = {
      ...trip,
      locations: trip.locations.filter(
        location => location.id !== locationId
      )
    }

    const confirmation = window.confirm(`Remove location "${location.city}"?`)
    if (!confirmation) {
      return
    }

    try {
      await dispatch(editTrip(updatedTrip))
      dispatch(showNotification(`Removed location "${location.city}" successfully`, 5000, 'success'))
      navigate(`/trips/${trip.id}`)
    } catch (error) {
      dispatch(showNotification(`Failed to remove "${location.city}."`, 5000, 'error'))
    }
  }

  return (
    <form className='editTripForm' onSubmit={handleSubmit}>
      <div className='editOuterSection'>
        <h2>Edit locations</h2>

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
              <label>Accommodation</label>
              <input
                value={location.accommodation || ''}
                onChange={(event) => {
                  const newLocations = [...locations]
                  newLocations[locationIndex].accommodation = event.target.value
                  setLocations(newLocations)
                }}
              />
            </div>

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
              <button className='cancelButton' type='button' onClick={() => handleDeleteLocation(location)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className='editRow'>
        <button type="submit">Save</button>
        <button className='cancelButton' type="button" onClick={() => navigate(`/trips/${trip.id}`)}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default LocationEditor