import { useParams, useNavigate } from 'react-router-dom'
import TripBudget from './TripBudget'

const Trip = ({ trips, deleteTrip }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  if (!trips.length) return <p>Loading trip...</p>

  const trip = trips.find(n => n.id == id)
  if (!trip) return <p>Trip not found</p>

  const editTrip = (event) => {
    event.preventDefault()
    navigate(`/trips/${trip.id}/edit`)
  }

  const handleDeleteTrip = (event) => {
    event.preventDefault()
    deleteTrip(id)
    navigate(`/`)
  }

  return (
    <div className='tripPageDiv'>
      <h2>{trip.title}</h2>
      <div className='tripDetailsButtons'>
        <button type="button" onClick={editTrip}>
          Edit
        </button>
        <button type="button" onClick={handleDeleteTrip}>
          Delete trip
        </button>
      </div>
      <div className='locationsDiv'>
        {trip.locations && trip.locations.map(location => (
          <div className='locationDiv' style={{ backgroundColor: location.backgroundColor }} key={location.id}>
            <div className='locationTitleDiv'>{location.city}, {location.country}</div>
            <div className='locationDetailDiv'>Notes: {location.notes}</div>
            <div className='locationDetailDiv'>From: {location.startDate.substring(0, 10)}</div>
            <div className='locationDetailDiv'>To: {location.endDate.substring(0, 10)}</div>
          </div>
        ))}
      </div>
      <TripBudget trip={trip} />
    </div>
  )
}

export default Trip
