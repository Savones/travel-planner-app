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

      <div className="summaryRoute">
        {locations.length
          ? locations.map(l => l.city).join(' → ')
          : '-'}
      </div>

      <div className="summaryGrid">
        <div className="summaryBox">
          <span>Days</span>
          <strong>{duration}</strong>
        </div>

        <div className="summaryBox">
          <span>Stops</span>
          <strong>{locationCount}</strong>
        </div>

        <div className="summaryBox">
          <span>Budget</span>
          <strong>${trip.budget ?? 0}</strong>
        </div>
      </div>

      <div className="summaryTravellers">
        <span>Travellers</span>
        <strong>
          {[trip.user.username, ...trip.users.map(u => u.username)].join(', ')}
        </strong>
      </div>
    </div>
  )
}

export default TripSummary