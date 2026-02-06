import { useState, useEffect } from 'react'
import tripService from './services/trips'
import Trip from './components/Trip'

const App = () => {
  const [trips, setTrips] = useState([])

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await tripService.getAll()
        setTrips(response)
      } catch (error) {
        console.error('Error fetching trips:', error)
      }
    }

    fetchTrips()
  }, [])

  return (
    <div>
      <h1>Travel planner</h1>
      {trips.map(trip => (
        <Trip
          key={trip.id}
          country={trip.country}
          startDate={trip.startDate}
          endDate={trip.endDate} />
      ))}
    </div>
  )
}

export default App

