const express = require('express')
const app = express()

let trips = [
  {
    "id": "a9c1",
    "title": "Liettua kesä 2026",
    "user": {
      "id": "u2",
      "username": "essi",
      "password": "456"
    },
    "locations": [
      {
        "location_id": 6287,
        "location": "Keikka paikka!",
        "startDate": "2026-02-11",
        "endDate": "2026-02-22"
      }
    ]
  }
]

app.get('/api/trips', (request, response) => {
  response.json(trips)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})