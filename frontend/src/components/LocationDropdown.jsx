import { useEffect, useState } from 'react'
import locationService from '../services/locations'

const LocationDropdown = () => {
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])

  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  useEffect(() => {
    locationService.getCountries().then(data => {
      setCountries(data)
    })
  }, [])

  useEffect(() => {
    if (selectedCountry) {
      locationService.getCities(selectedCountry).then(data => {
        setCities(data)
      })
    }
  }, [selectedCountry])

  return (
    <div>
      <div>
        <select
          value={selectedCountry}
          onChange={(event) => setSelectedCountry(event.target.value)}
        >
          <option value="">Select country</option>
          {countries.map(country => (
            <option key={country.iso2} value={country.iso2}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select
          value={selectedCity}
          onChange={(event) => setSelectedCity(event.target.value)}
        >
          <option value="">Select city</option>
          {cities.map(city => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default LocationDropdown
