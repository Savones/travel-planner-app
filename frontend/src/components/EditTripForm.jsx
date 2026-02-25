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

  const cancel = (event) => {
    event.preventDefault()
    navigate(`/trips/${trip.id}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input
          type={title.type}
          value={title.value}
          onChange={title.onChange}
        />
      </div>
      {locations.map((location, locationIndex) => (
        <div key={location.location_id}>
          <div>
            <label>Location</label>
            <input
              value={location.location}
              onChange={(event) => {
                const newLocations = [...locations]
                newLocations[locationIndex].location = event.target.value
                setLocations(newLocations)
              }}
            />
          </div>
          <div>
            <label>Start Date</label>
            <input
              type="date"
              value={location.startDate.substring(0, 10)}
              onChange={(event) => {
                const newLocations = [...locations]
                newLocations[locationIndex].startDate = event.target.value
                setLocations(newLocations)
              }}
            />
          </div>
          <div>
            <label>End Date</label>
            <input
              type="date"
              value={location.endDate.substring(0, 10)}
              onChange={(event) => {
                const newLocations = [...locations]
                newLocations[locationIndex].endDate = event.target.value
                setLocations(newLocations)
              }}
            />
          </div>
        </div>
      ))}
      <button onClick={cancel}>Cancel</button>
      <button type="submit">Save</button>
    </form>
  )
}

export default EditTripForm
