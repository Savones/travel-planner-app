import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useField } from '../hooks'

const EditTripForm = ({ trips, updateTrip }) => {
  const title = useField('text')
  const [locations, setLocations] = useState([])
  const { id } = useParams()
  const navigate = useNavigate()

  const trip = trips.find(n => n.id == id)
  useEffect(() => {
    if (trip) {
      title.setValue(trip.title)
      setLocations(trip.locations || [])
    }
  }, [trip])

  if (!trip) {
    return <p>Loading trip...</p>
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    updateTrip({
      ...trip,
      title: title.value,
      locations
    })
    navigate(`/trips/${trip.id}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type={title.type}
        value={title.value}
        onChange={title.onChange}
      />
      {locations.map((location, locationIndex) => (
        <div key={location.location_id}>
          <input
            value={location.location}
            onChange={(event) => {
              const newLocations = [...locations]
              newLocations[locationIndex].location = event.target.value
              setLocations(newLocations)
            }}
          />
        </div>
      ))}
      <button type="submit">Save</button>
    </form>
  )
}

export default EditTripForm
