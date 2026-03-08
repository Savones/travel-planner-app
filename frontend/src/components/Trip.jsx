import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import LocationForm from './LocationForm'
import TripBudget from './TripBudget'

const Trip = ({ trips, addNewLocation, deleteTrip, deleteLocation }) => {
  const [showLocationForm, setShowLocationForm] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()

  if (!trips.length) return <p>Loading trip...</p>

  const trip = trips.find(n => n.id == id)
  if (!trip) return <p>Trip not found</p>

  const changeFormVisibility = (event) => {
    event.preventDefault()
    showLocationForm ? setShowLocationForm(false) : setShowLocationForm(true)
  }

  const handleAddLocation = (location) => {
    showLocationForm ? setShowLocationForm(false) : setShowLocationForm(true)
    const updatedTrip = {
      ...trip,
      locations: trip.locations
        ? trip.locations.concat(location)
        : [location]
    }
    addNewLocation(updatedTrip)
  }

  const editTrip = (event) => {
    event.preventDefault()
    navigate(`/trips/${trip.id}/edit`)
  }

  const handleDeleteTrip = (event) => {
    event.preventDefault()
    deleteTrip(id)
    navigate(`/`)
  }

  const addBudget = (event) => {
    event.preventDefault()
    navigate(`/trips/${trip.id}/budget`)
  }

  const handleDeleteLocation = (locationId) => {
    const updatedTrip = {
      ...trip,
      locations: trip.locations.filter(
        location => location.id !== locationId
      )
    }
    deleteLocation(updatedTrip)
  }

  return (
    <div className='tripPageDiv'>
      <h2>{trip.title}</h2>
      <div className='tripDetailsButtons'>
        {!showLocationForm &&
          <button type="button" onClick={changeFormVisibility}>
            Add location
          </button>}
        {!trip.budget &&
          <button type='button' onClick={addBudget}>Create budget</button>
        }
        <button type="button" onClick={editTrip}>
          Edit
        </button>
        <button type="button" onClick={handleDeleteTrip}>
          Delete trip
        </button>
      </div>
      {showLocationForm && <LocationForm id={id} addNew={handleAddLocation} handleCancel={changeFormVisibility} />}
      <div className='locationsDiv'>
        {trip.locations && trip.locations.map(location => (
          <div className='locationDiv' key={location.id}>
            <div className='locationTitleDiv'>{location.city}, {location.country}</div>
            <div className='locationDetailDiv'>{location.location}</div>
            <div className='locationDetailDiv'>From: {location.startDate.substring(0, 10)}</div>
            <div className='locationDetailDiv'>To: {location.endDate.substring(0, 10)}</div>
            <button type='button' onClick={() => handleDeleteLocation(location.id)}>
              Delete location
            </button>
          </div>
        ))}
      </div>
      <TripBudget trip={trip} />
    </div>
  )
}

export default Trip
