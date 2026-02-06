import { useParams } from 'react-router-dom'

const Trip = ({ trips }) => {
  const { id } = useParams()

  if (!trips.length) return <p>Loading trip...</p>

  const trip = trips.find(n => n.id == id)
  if (!trip) return <p>Trip not found</p>

  return (
    <div>
      <h2>{trip.country}</h2>
      <p>{trip.startDate} - {trip.endDate}</p>
    </div>
  )
}

export default Trip
