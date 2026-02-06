import { useState, useEffect } from 'react'
import tripService from './services/trips'
import Trip from './components/Trip'
import TripList from './components/TripList'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useParams
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

  return (
    <Router>
      <div>
        <h1>Travel planner</h1>
        <Routes>
          <Route path="/trips/:id" element={<Trip trips={trips} />} />
          <Route path="/" element={<TripList trips={trips} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

