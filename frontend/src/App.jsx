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
    tripService
      .create(trip)
      .then(returnedTrip => {
        setTrips(trips.concat(returnedTrip))
      })
  }

  const addNewLocation = (trip) => {
    tripService
      .update(trip)
      .then(returnedTrip => {
        setTrips(trips.map(t =>
          t.id === returnedTrip.id ? returnedTrip : t
        ))
      })
  }

  return (
    <Router>
      <div>
        <Menu />
        <h1>Travel planner</h1>
        <Routes>
          <Route path="/trips/:id" element={<Trip addNewLocation={addNewLocation} trips={trips} />} />
          <Route path="/" element={<TripList trips={trips} />} />
          <Route path="/create" element={<TripForm addNew={addNew} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

