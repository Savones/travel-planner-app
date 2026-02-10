import { useParams } from 'react-router-dom'
import { useState } from 'react'
import LocationForm from './LocationForm'

const Trip = ({ trips }) => {
  const [showLocationForm, setShowLocationForm] = useState(false)
  const { id } = useParams()

  if (!trips.length) return <p>Loading trip...</p>

  const trip = trips.find(n => n.id == id)
  if (!trip) return <p>Trip not found</p>

  const addLocation = (event) => {
    event.preventDefault()
    showLocationForm ? setShowLocationForm(false) : setShowLocationForm(true)
  }

  return (
    <div>
      <h2>{trip.title}</h2>
      <button type="button" onClick={addLocation}>
        Add location
      </button>
      {showLocationForm && <LocationForm />}
    </div>
  )
}

export default Trip
