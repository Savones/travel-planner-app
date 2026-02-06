import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [trips, setTrips] = useState([])

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/trips')
      .then(response => {
        console.log('promise fulfilled')
        setTrips(response.data)
      })
  }, [])

  return (
    <div>
      <h1>Travel planner</h1>
      {trips.map(trip => <h3>{trip.country}</h3>)}
    </div>
  )
}

export default App
