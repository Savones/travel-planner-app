import LocationDropdown from './LocationDropdown'
import { useField } from '../hooks'
import { useState, useEffect } from 'react'
import locationService from '../services/locations'

const LocationForm = ({ addNew, handleCancel }) => {
  const location = useField('text')
  const startDate = useField('date')
  const endDate = useField('date')

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
    event.preventDefault()
    const location_id = Math.round(Math.random() * 10000)
    addNew({
      location_id: location_id,
      country: selectedCountry.name,
      city: selectedCity,
      location: location.value,
      startDate: startDate.value,
      endDate: endDate.value
    })
  }

  return (
    <div>
      <h3>Add new location</h3>
      <form onSubmit={handleSubmit}>
        <LocationDropdown
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          countries={countries}
          cities={cities}
        />
        <div>
          Location
          <input {...location} />
        </div>
        <div>
          Start date
          <input {...startDate} />
        </div>
        <div>
          End date
          <input {...endDate} />
        </div>
        <input type='button' value='Cancel' onClick={handleCancel} />
        <input type='submit' value='Add' />
      </form>
    </div>
  )
}

export default LocationForm