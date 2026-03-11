const TripSummary = ({ trip }) => {
  const locations = trip.locations

  const getTripDuration = (locations) => {
    if (!locations || locations.length === 0) return 0

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
      <h3>Summary</h3>
      <div>{locations.map(location => location.city).join(' → ')}</div>
      <div>{duration} days</div>
      <div>{locationCount} locations</div>
      <div>${trip.budget} budget</div>
    </div>
  )
}

export default TripSummary