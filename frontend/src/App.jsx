import { useEffect } from 'react'
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
import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { setUser, clearUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'
import { initializeTrips } from './reducers/tripReducer'
import Notification from './components/Notification'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

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
  }, [dispatch])

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser")
    tripService.setToken(null)
    dispatch(clearUser())
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
          <Route path="/trips/:id" element={<ProtectedRoute user={user}><Trip /></ProtectedRoute>} />
          <Route path="/trips/:id/edit" element={<ProtectedRoute user={user}><EditTripForm /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute user={user}><TripList /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute user={user}><TripForm /></ProtectedRoute>} />
          <Route path="/trips/:id/addLocation" element={<ProtectedRoute user={user}><LocationForm /></ProtectedRoute>} />
        </Routes>
      </>
    </Router>
  )
}

export default App

