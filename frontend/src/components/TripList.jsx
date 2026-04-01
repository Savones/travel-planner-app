import { Link } from 'react-router-dom'
import tripUtils from '../utils/tripUtils'
import { useSelector } from 'react-redux'

const images = [
  '/images/fuji.jpg',
  '/images/japan.jpg',
  '/images/norway.jpg',
  '/images/paris.jpg',
  '/images/nz.jpg'
]

const TripList = () => {
  const user = useSelector(state => state.user)
  const trips = useSelector(state => state.trips)

  if (!user) return

  const userTrips = trips.filter(trip => trip.user?.id === user.id)
  return (
    <>
      <div className="tripFiltersDiv">
        <label>
          <input type="checkbox" />
          Upcoming
        </label>
        <label>
          <input type="checkbox" />
          Shared with me
        </label>
        <label>
          <input type="checkbox" />
          Past trips
        </label>
      </div>
      <div className='tripListDiv'>
        {userTrips.map((trip, index) => (
          <Link key={trip.id} to={`/trips/${trip.id}`}>
            <div className='tripBannerDiv'>
              <img src={images[index % images.length]} alt={trip.title} />
              <div className='tripDetailsDiv'>
                <div className='tripTitleDiv'>{trip.title}</div>
                <div className='tripDatesDiv'>{tripUtils.getTripDateRange(trip.locations)}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

export default TripList