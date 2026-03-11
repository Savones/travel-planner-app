import { useParams, useNavigate } from 'react-router-dom'
import TripSummary from './TripSummary'
import tripService from '../services/trips'
import { useState, useEffect } from 'react'

const Trip = ({ deleteTrip }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [trip, setTrip] = useState(null)

  useEffect(() => {
    const fetchTrip = async () => {
      const returnedTrip = await tripService.getById(id)
      setTrip(returnedTrip)
    }

    fetchTrip()
  }, [id])

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
      <TripSummary trip={trip} />
      <div className='locationsDiv'>
        {trip.locations && trip.locations.map(location => (
          <div className='locationDiv' style={{ backgroundColor: location.backgroundColor }} key={location.id}>
            <div className='locationTitleDiv'>{location.city}, {location.country}</div>
            <div className='locationDetailDiv'>Notes: {location.notes}</div>
            <div className='locationDetailDiv'>From: {new Date(location.startDate).toLocaleDateString('fi-FI')}</div>
            <div className='locationDetailDiv'>To: {new Date(location.endDate).toLocaleDateString('fi-FI')}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Trip
