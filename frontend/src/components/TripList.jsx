import { Link } from 'react-router-dom'

const TripList = ({ trips }) => {
  return (
    <div>
      {trips.map(trip => (
        <h3 key={trip.id}>
          <Link to={`/trips/${trip.id}`}>{trip.country}</Link>
        </h3>
      ))}
    </div>
  )
}

export default TripList