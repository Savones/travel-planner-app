import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import LocationForm from './LocationForm'

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
    <div>
      <h2>{trip.title}</h2>
      {!showLocationForm &&
        <button type="button" onClick={changeFormVisibility}>
          Add location
        </button>}
      <button type="button" onClick={editTrip}>
        Edit
      </button>
      <button type="button" onClick={handleDeleteTrip}>
        Delete trip
      </button>
      {showLocationForm && <LocationForm id={id} addNew={handleAddLocation} handleCancel={changeFormVisibility} />}
      {trip.locations && trip.locations.map(location => (
        <div key={location.id}>
          <p>{location.location_id}</p>
          <h3>{location.city}, {location.country}</h3>
          <p>{location.location}</p>
          <p>From: {location.startDate.substring(0, 10)}</p>
          <p>To: {location.endDate.substring(0, 10)}</p>
          <button type='button' onClick={() => handleDeleteLocation(location.id)}>
            Delete location
          </button>
        </div>
      ))}
    </div>
  )
}

export default Trip
