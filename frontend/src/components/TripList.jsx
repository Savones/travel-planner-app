import { Link } from 'react-router-dom'
import tripUtils from '../utils/tripUtils'
import { useSelector } from 'react-redux'

const TripList = ({ trips }) => {
  const user = useSelector(state => state.user)

  if (!user) return

  const userTrips = trips.filter(trip => trip.user?.id === user.id)
  return (
    <div className='homePageDiv'>
      <div className='tripListDiv'>
        {userTrips.map(trip => (
          <Link key={trip.id} to={`/trips/${trip.id}`}>
            <div className='tripBannerDiv'>
              <div className='tripTitleDiv'>
                {trip.title}
              </div>
              <div className='tripDatesDiv'>
                {tripUtils.getTripDateRange(trip.locations)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TripList