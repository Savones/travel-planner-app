import { useParams } from 'react-router-dom'
import { useState } from 'react'
import LocationForm from './LocationForm'

const Trip = ({ trips, addNewLocation }) => {
  const [showLocationForm, setShowLocationForm] = useState(false)
  const { id } = useParams()

  if (!trips.length) return <p>Loading trip...</p>

  const trip = trips.find(n => n.id == id)
  if (!trip) return <p>Trip not found</p>

  const addLocationClick = (event) => {
    event.preventDefault()
    showLocationForm ? setShowLocationForm(false) : setShowLocationForm(true)
  }

  const handleAddLocation = (location) => {
    const updatedTrip = {
      ...trip,
      locations: trip.locations
        ? trip.locations.concat(location)
        : [location]
    }

    addNewLocation(updatedTrip)
  }

  return (
    <div>
      <h2>{trip.title}</h2>
      <button type="button" onClick={addLocationClick}>
        Add location
      </button>
      {showLocationForm && <LocationForm id={id} addNew={handleAddLocation} />}
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
