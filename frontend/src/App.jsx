import { useState, useEffect } from 'react'
import tripService from './services/trips'
import Trip from './components/Trip'
import TripList from './components/TripList'
import TripForm from './components/TripForm'
import Menu from './components/Menu'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

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

  const addNew = (trip) => {
    trip.id = Math.round(Math.random() * 10000)
    tripService
      .create(trip)
      .then(returnedTrip => {
        setTrips(trips.concat(returnedTrip))
      })
  }

  return (
    <Router>
      <div>
        <Menu />
        <h1>Travel planner</h1>
        <Routes>
          <Route path="/trips/:id" element={<Trip trips={trips} />} />
          <Route path="/" element={<TripList trips={trips} />} />
          <Route path="/create" element={<TripForm addNew={addNew} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

