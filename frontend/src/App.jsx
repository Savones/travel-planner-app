import { useEffect, useState } from 'react'
import tripService from './services/trips'
import Trip from './components/Trip'
import TripList from './components/TripList'
import TripForm from './components/TripForm'
import Menu from './components/Menu'
import LoginForm from './components/LoginForm'
import SignUpForm from './components/SignUpForm'
import EditTripForm from './components/EditTripForm'
import LocationForm from './components/LocationForm'
import ProtectedRoute from './components/ProtectedRoute'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, clearUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'
import { initializeTrips } from './reducers/tripReducer'
import Notification from './components/Notification'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dispatch(initializeTrips())
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem("loggedUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      tripService.setToken(user.token)
    }
    setLoading(false)
  }, [dispatch])

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser")
    tripService.setToken(null)
    dispatch(clearUser())
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Router>
      <>
        <div className='menuButtonsDiv'>
          <div className='headerLogo'>Travel planner</div>
          {user && <Menu handleLogout={handleLogout} />}
        </div>
        <Notification />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/trips/:id" element={<ProtectedRoute><Trip /></ProtectedRoute>} />
          <Route path="/trips/:id/edit" element={<ProtectedRoute><EditTripForm /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><TripList /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><TripForm /></ProtectedRoute>} />
          <Route path="/trips/:id/addLocation" element={<ProtectedRoute><LocationForm /></ProtectedRoute>} />
        </Routes>
      </>
    </Router>
  )
}

export default App

