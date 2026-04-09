import LocationDropdown from './LocationDropdown'
import { useField } from '../hooks'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import locationService from '../services/locations'
import { useDispatch, useSelector } from 'react-redux'
import { editTrip } from '../reducers/tripReducer'
import { showNotification } from '../reducers/notificationReducer'

const LocationForm = () => {
  const { id } = useParams()
  const trip = useSelector(state =>
    state.trips.find(t => t.id === id)
  )

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const notes = useField('text')
  const startDate = useField('date')
  const endDate = useField('date')
  const backgroundColor = useField('color')

  const { setValue: setNotes, ...notesInput } = notes
  const { setValue: setStartDate, ...startDateInput } = startDate
  const { setValue: setEndDate, ...endDateInput } = endDate
  const { setValue: setColor, ...backgroundColorInput } = backgroundColor

  const [countries, setCountries] = useState([])
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [cities, setCities] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedCity, setSelectedCity] = useState('')

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await locationService.getCountries()
        setCountries(data)
      } catch (error) {
        dispatch(showNotification('Failed to load countries', 5000))
      } finally {
        setLoadingCountries(false)
      }
    }

    fetchCountries()
  }, [dispatch])

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry) return

      try {
        const data = await locationService.getCities(selectedCountry.iso2)
        setCities(data)
      } catch (error) {
        dispatch(showNotification(`Failed to fetch countries. Error: ${error.response.data.error}`))
      }
    }

    fetchCities()
  }, [selectedCountry, dispatch])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!selectedCountry || !selectedCity) {
      dispatch(showNotification('Select country and city.', 5000))
      return
    }

    if (!startDate.value || !endDate.value) {
      dispatch(showNotification('Select start and end dates.', 5000))
      return
    }

    if (new Date(startDate.value) > new Date(endDate.value)) {
      dispatch(showNotification('Start date must be before end date.', 5000))
      return
    }

    const newLocation = {
      country: selectedCountry.name,
      city: selectedCity,
      notes: notes.value || '',
      startDate: startDate.value,
      endDate: endDate.value,
      backgroundColor: backgroundColor.value || '#ffffff'
    }

    const updatedTrip = {
      ...trip,
      locations: trip.locations
        ? trip.locations.concat(newLocation)
        : [newLocation]
    }

    try {
      await dispatch(editTrip(updatedTrip))
      dispatch(showNotification(`Added location "${newLocation.city}"`, 5000))
      navigate(`/trips/${trip.id}`)
    } catch (error) {
      dispatch(showNotification(`Failed to add a location "${newLocation.city}". Error: ${error.response.data.error}`))
    }
  }

  const handleCancel = (event) => {
    event.preventDefault()
    navigate(`/trips/${trip.id}`)
  }

  if (loadingCountries) {
    return <p>Loading...</p>
  }

  return (
    <div className='editOuterSection'>
      <h3>Add new location</h3>
      <form onSubmit={handleSubmit}>
        <div className='editSection'>
          <LocationDropdown
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            countries={countries}
            cities={cities}
          />

          <div className='editRow'>
            <label>Notes</label>
            <input {...notesInput} />
          </div>

          <div className='editRow'>
            <label>Start date</label>
            <input {...startDateInput} />
          </div>

          <div className='editRow'>
            <label>End date</label>
            <input {...endDateInput} />
          </div>

          <div className='editRow'>
            <label>Background color</label>
            <input
              {...backgroundColorInput}
              value={backgroundColor.value || '#ffffff'}
            />
          </div>
        </div>
        <div className='editRow'>
          <input type='submit' value='Add' />
          <input type='button' value='Cancel' onClick={handleCancel} />
        </div>
      </form>
    </div>
  )
}

export default LocationForm