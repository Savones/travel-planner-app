import { useSelector } from "react-redux"

const TripSummary = ({ trip }) => {
  const locations = trip.locations || []
  const user = useSelector(state => state.user)

  const getTripDuration = (locations) => {
    if (!locations.length) return 0

    const startDates = locations.map(location => new Date(location.startDate))
    const endDates = locations.map(location => new Date(location.endDate))
    const earliest = new Date(Math.min(...startDates))
    const latest = new Date(Math.max(...endDates))

    const diff = latest - earliest

    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
  }

  const duration = getTripDuration(locations)
  const locationCount = locations.length

  return (
    <div className="tripSummaryDiv">
      <h3>Trip summary</h3>

      <div>
        {locations.length
          ? locations.map(l => l.city).join(' → ')
          : ''}
      </div>

      <div>{duration} days</div>

      <div>
        {locationCount} {locationCount === 1 ? 'location' : 'locations'}
      </div>

      <div>${trip.budget ?? 0} budget</div>
      <div>Travellers: {user.username}</div>
    </div>
  )
}

export default TripSummary