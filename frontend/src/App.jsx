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
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { setUser, clearUser } from './reducers/userReducer'
import { initializeTrips } from './reducers/tripReducer'
import Notification from './components/Notification'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeTrips())
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
          <Route path="/trips/:id" element={<Trip />} />
          <Route path="/trips/:id/edit" element={<EditTripForm />} />
          <Route path="/" element={<TripList />} />
          <Route path="/create" element={<TripForm />} />
          <Route path="/trips/:id/addLocation" element={<LocationForm />} />
        </Routes>
      </>
    </Router>
  )
}

export default App

