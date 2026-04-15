const LocationDropdown = ({
  selectedCountry,
  setSelectedCountry,
  selectedCity,
  setSelectedCity,
  countries,
  cities
}) => {
  return (
    <>
      <div>
        <select
          value={selectedCountry?.iso2 || ''}
          onChange={(event) => {
            const country = countries.find(c => c.iso2 === event.target.value)
            setSelectedCountry(country)
          }}
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
          {cities.map((city, index) => (
            <option key={`${city.name}-${index}`} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

export default LocationDropdown
