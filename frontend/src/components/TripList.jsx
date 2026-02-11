import { Link } from 'react-router-dom'

const TripList = ({ user, trips }) => {
  if (!user) return

  const userTrips = trips.filter(trip => trip.user?.id === user.id)
  return (
    <div>
      {userTrips.map(trip => (
        <h3 key={trip.id}>
          <Link to={`/trips/${trip.id}`}>{trip.title} - {trip.user.username}</Link>
        </h3>
      ))}
    </div>
  )
}

export default TripList