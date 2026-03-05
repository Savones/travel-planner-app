import { Link } from 'react-router-dom'

const TripList = ({ user, trips }) => {
  if (!user) return

  const userTrips = trips.filter(trip => trip.user?.id === user.id)
  return (
    <div className='homePageDiv'>
      <div className='tripListDiv'>
        {userTrips.map(trip => (
          <Link to={`/trips/${trip.id}`}>
            <div key={trip.id} className='tripBannerDiv'>
              <div className='tripTitleDiv'>
                {trip.title}
              </div>
              <div className='tripDatesDiv'>
                X.X.XXXX - Y.Y.YYYY
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TripList