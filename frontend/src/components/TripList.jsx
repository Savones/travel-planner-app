import { Link } from 'react-router-dom'
import tripUtils from '../utils/tripUtils'
import { useSelector } from 'react-redux'
import { useState } from 'react'

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

  const userTrips = trips.filter(trip => trip.user?.id === user.id)
  const sharedTrips = trips.filter(trip => trip.users?.some(u => u.id === user.id))
  const allTrips = [...userTrips, ...sharedTrips]
  const [filters, setFilters] = useState({
    upcoming: false, ongoing: false, shared: false, past: false
  })

  if (!user) return

  const now = new Date()

  const filteredTrips = allTrips.filter(trip => {
    const isShared = trip.user.id !== user.id

    const hasFuture = trip.locations?.some(location =>
      new Date(location.startDate) > now
    )

    const hasPast = trip.locations?.some(location =>
      new Date(location.endDate) < now
    )

    const isOngoing = trip.locations?.some(location => {
      const start = new Date(location.startDate)
      const end = new Date(location.endDate)
      const hasStarted = start <= now
      const hasNotEnded = end >= now
      return hasStarted && hasNotEnded
    })

    if (filters.shared && !isShared) return false
    if (filters.upcoming && !hasFuture) return false
    if (filters.past && !hasPast) return false
    if (filters.ongoing && !isOngoing) return false

    return true
  })

  const handleFilterChange = (filter) => {
    setFilters(previousFilter => ({
      ...previousFilter,
      [filter]: !previousFilter[filter]
    }))
  }

  return (
    <>
      <div className="tripFiltersDiv">

        <label>
          <input
            type="checkbox"
            checked={filters.upcoming}
            onChange={() => handleFilterChange('upcoming')}
          />
          Upcoming
        </label>

        <label>
          <input
            type="checkbox"
            checked={filters.ongoing}
            onChange={() => handleFilterChange('ongoing')}
          />
          Ongoing
        </label>

        <label>
          <input
            type="checkbox"
            checked={filters.past}
            onChange={() => handleFilterChange('past')}
          />
          Past trips
        </label>

        <label>
          <input
            type="checkbox"
            checked={filters.shared}
            onChange={() => handleFilterChange('shared')}
          />
          Shared with me
        </label>
      </div>
      <div className='tripListDiv'>
        {filteredTrips.map((trip, index) => (
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