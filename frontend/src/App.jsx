import { useState, useEffect } from 'react'
import tripService from './services/trips'
import Trip from './components/Trip'
import TripList from './components/TripList'
import TripForm from './components/TripForm'
import Menu from './components/Menu'
import LoginForm from './components/LoginForm'
import SignUpForm from './components/SignUpForm'
import EditTripForm from './components/EditTripForm'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

const App = () => {
  const [user, setUser] = useState(null)
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

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem("loggedUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      tripService.setToken(user.token)
    }
  }, [])

  const addNew = async (trip) => {
    const returnedTrip = await tripService.create(trip)

    setTrips(prevTrips =>
      prevTrips.concat(returnedTrip)
    )

    return returnedTrip
  }


  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser")
    tripService.setToken(null)
    setUser(null)
  }

  const updateTrip = (trip) => {
    tripService
      .update(trip)
      .then(returnedTrip => {
        setTrips(trips.map(t =>
          t.id === returnedTrip.id ? returnedTrip : t
        ))
      })
  }

  const deleteTrip = (tripId) => {
    tripService
      .deleteTrip(tripId)
      .then(() => {
        setTrips(trips.filter(t => t.id !== tripId))
      })
  }

  return (
    <Router>
      <>
        <div className='menuButtonsDiv'>
          <div className='headerLogo'>Travel planner</div>
          {user && <Menu handleLogout={handleLogout} />}
        </div>
        <Routes>
          <Route path="/login" element={<LoginForm setUser={setUser} />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/trips/:id" element={<Trip deleteLocation={updateTrip} deleteTrip={deleteTrip} addNewLocation={updateTrip} trips={trips} />} />
          <Route path="/trips/:id/edit" element={<EditTripForm trips={trips} updateTrip={updateTrip} />} />
          <Route path="/" element={<TripList user={user} trips={trips} />} />
          <Route path="/create" element={<TripForm user={user} addNew={addNew} />} />
        </Routes>
      </>
    </Router>
  )
}

export default App

