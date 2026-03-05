import LocationDropdown from './LocationDropdown'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useField } from '../hooks'
import locationService from '../services/locations'

const EditTripForm = ({ trips, updateTrip }) => {
  const title = useField('text')
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
      locations: updatedLocations
    })
    navigate(`/trips/${trip.id}`)
  }

  const cancel = (event) => {
    event.preventDefault()
    navigate(`/trips/${trip.id}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input
          type={title.type}
          value={title.value}
          onChange={title.onChange}
        />
      </div>
      {locations.map((location, locationIndex) => (
        <div key={location.location_id}>
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
            <label>Location</label>
            <input
              value={location.location}
              onChange={(event) => {
                const newLocations = [...locations]
                newLocations[locationIndex].location = event.target.value
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
        </div>
      ))}
      <button onClick={cancel}>Cancel</button>
      <button type="submit">Save</button>
    </form>
  )
}

export default EditTripForm
