import { Link } from 'react-router-dom'
import tripUtils from '../utils/tripUtils'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useField } from '../hooks'

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
  const search = useField('search')

  const userTrips = trips.filter(trip => trip.user?.id === user.id)
  const sharedTrips = trips.filter(trip => trip.users?.some(u => u.id === user.id))
  const allTrips = [...userTrips, ...sharedTrips]
  const [filters, setFilters] = useState({
    upcoming: false, ongoing: false, shared: false, past: false
  })

  if (!user) return

  const now = new Date()

  const counts = {
    upcoming: allTrips.filter(trip =>
      trip.locations?.some(loc => new Date(loc.startDate) > now)
    ).length,

    ongoing: allTrips.filter(trip =>
      trip.locations?.some(loc => {
        const start = new Date(loc.startDate)
        const end = new Date(loc.endDate)
        return start <= now && end >= now
      })
    ).length,

    past: allTrips.filter(trip =>
      trip.locations?.some(loc => new Date(loc.endDate) < now)
    ).length,

    shared: allTrips.filter(trip =>
      trip.user.id !== user.id
    ).length
  }

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

  const searched = filteredTrips.filter(trip =>
    trip.title.toLowerCase().includes((search.value || '').toLowerCase())
  )

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
          Upcoming ({counts.upcoming})
        </label>

        <label>
          <input
            type="checkbox"
            checked={filters.ongoing}
            onChange={() => handleFilterChange('ongoing')}
          />
          Ongoing ({counts.ongoing})
        </label>

        <label>
          <input
            type="checkbox"
            checked={filters.past}
            onChange={() => handleFilterChange('past')}
          />
          Past trips ({counts.past})
        </label>

        <label>
          <input
            type="checkbox"
            checked={filters.shared}
            onChange={() => handleFilterChange('shared')}
          />
          Shared with me ({counts.shared})
        </label>
        <div
          className='searchBar'>
          <input type={search.type}
            value={search.value}
            onChange={search.onChange}
            placeholder='Search...' />
        </div>
      </div>
      <div className='tripListDiv'>
        {searched.map((trip, index) => (
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