import { Link } from 'react-router-dom'

const TripList = ({ user, trips }) => {
  if (!user) return

  const userTrips = trips.filter(trip => trip.user?.id === user.id)
  return (
    <div>
      {userTrips.map(trip => (
        <Link to={`/trips/${trip.id}`}>
          <div key={trip.id} className='tripBannerDiv'>
            {trip.title}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default TripList