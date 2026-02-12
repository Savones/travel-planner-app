import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import LocationForm from './LocationForm'

const Trip = ({ trips, addNewLocation }) => {
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
      {showLocationForm && <LocationForm id={id} addNew={handleAddLocation} handleCancel={changeFormVisibility} />}
      {trip.locations && trip.locations.map(location => (
        <div key={location.location_id}>
          <h3>{location.location}</h3>
          <p>From: {location.startDate}</p>
          <p>To: {location.endDate}</p>
        </div>
      ))}
    </div>
  )
}

export default Trip
