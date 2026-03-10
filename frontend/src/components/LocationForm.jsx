import LocationDropdown from './LocationDropdown'
import { useField } from '../hooks'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import locationService from '../services/locations'

const LocationForm = ({ updateTrip, trips }) => {
  const { id } = useParams()
  const trip = trips.find(n => n.id == id)
  const navigate = useNavigate()

  const location = useField('text')
  const startDate = useField('date')
  const endDate = useField('date')
  const backgroundColor = useField('color')

  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])

  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedCity, setSelectedCity] = useState('')

  useEffect(() => {
    locationService.getCountries().then(data => {
      setCountries(data)
    })
  }, [])

  useEffect(() => {
    if (selectedCountry) {
      locationService.getCities(selectedCountry.iso2).then(data => {
        setCities(data)
      })
    }
  }, [selectedCountry])

  const handleSubmit = (event) => {
    console.log("submit")
    event.preventDefault()
    const location_id = Math.round(Math.random() * 10000)
    const newLocation = {
      location_id: location_id,
      country: selectedCountry.name,
      city: selectedCity,
      location: location.value,
      startDate: startDate.value,
      endDate: endDate.value,
      backgroundColor: backgroundColor.value
    }
    updateTrip({
      ...trip,
      locations: trip.locations
        ? trip.locations.concat(newLocation)
        : [newLocation]
    })
    navigate(`/trips/${trip.id}`)
  }

  const handleCancel = (event) => {
    event.preventDefault()
    navigate(`/trips/${trip.id}`)
  }

  return (
    <div className='newLocationDiv'>
      <h3>Add new location</h3>
      <form className='newLocationForm' onSubmit={handleSubmit}>
        <LocationDropdown
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          countries={countries}
          cities={cities}
        />
        <div>
          <label>Location</label>
          <input {...location} />
        </div>
        <div>
          <label>Start date</label>
          <input {...startDate} />
        </div>
        <div>
          <label>End date</label>
          <input {...endDate} />
        </div>
        <div>
          <label>Background color</label>
          <input {...backgroundColor} />
        </div>
        <input type='submit' value='Add' />
        <input type='button' value='Cancel' onClick={handleCancel} />
      </form>
    </div>
  )
}

export default LocationForm