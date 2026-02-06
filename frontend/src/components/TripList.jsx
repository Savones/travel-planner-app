import { Link } from 'react-router-dom'

const TripList = ({ trips }) => {
  return (
    <div>
      {trips.map(trip => (
        <p key={trip.id}>
          <Link to={`/trips/${trip.id}`}>{trip.country}</Link>
        </p>
      ))}
    </div>
  )
}

export default TripList