import LocationDropdown from './LocationDropdown'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useField } from '../hooks'
import locationService from '../services/locations'

const EditTripForm = ({ trips, updateTrip }) => {
  const title = useField('text')
  const budget = useField('number')

  const [locations, setLocations] = useState([])
  const [countries, setCountries] = useState([])

  const { id } = useParams()
  const navigate = useNavigate()

  const trip = trips.find(n => n.id === id)

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
      budget.setValue(trip.budget)
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
    updateTrip({
      ...trip,
      title: title.value,
      budget: budget.value,
      locations: updatedLocations
    })
    navigate(`/trips/${trip.id}`)
  }

  const cancel = (event) => {
    event.preventDefault()
    navigate(`/trips/${trip.id}`)
  }

  const handleDeleteLocation = (locationId) => {
    const updatedTrip = {
      ...trip,
      locations: trip.locations.filter(
        location => location.id !== locationId
      )
    }
    updateTrip(updatedTrip)
    navigate(`/trips/${trip.id}`)
  }

  return (
    <form className='editTripForm' onSubmit={handleSubmit}>
      <div className='editTitleDiv'>
        <label>Title</label>
        <input
          type={title.type}
          value={title.value}
          onChange={title.onChange}
        />
      </div>
      <div className='editLocationsDiv'>
        <h3>Locations</h3>
        <button onClick={handleAddLocation}>Add location</button>
        {locations.map((location, locationIndex) => (
          <div className='editLocationDiv' key={location.location_id}>
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

            <div>
              <label>Notes</label>
              <input
                value={location.notes}
                onChange={(event) => {
                  const newLocations = [...locations]
                  newLocations[locationIndex].notes = event.target.value
                  setLocations(newLocations)
                }}
              />
            </div>
            <div>
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
            <div>
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
            <div>
              <label>Background color</label>
              <input
                type='color'
                value={location.backgroundColor}
                onChange={(event) => {
                  const newLocations = [...locations]
                  newLocations[locationIndex].backgroundColor = event.target.value
                  setLocations(newLocations)
                }}
              />
            </div>
            <button type='button' onClick={() => handleDeleteLocation(location.id)}>
              Delete location
            </button>
          </div>
        ))}
      </div>
      <div className='editBudgetDiv'>
        <h3>Budget</h3>
        <button>Add cost</button>
        <div className='editcostDiv'>
          <label>Total budget</label>
          <input
            type={budget.type}
            value={budget.value}
            onChange={budget.onChange}
          />
        </div>
      </div>
      <button type="submit">Save</button>
      <button onClick={cancel}>Cancel</button>
    </form>
  )
}

export default EditTripForm
