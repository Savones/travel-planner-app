import { createSlice } from '@reduxjs/toolkit'
import tripService from '../services/trips'

const tripSlice = createSlice({
  name: 'trips',
  initialState: [],
  reducers: {
    setTrips(state, action) {
      return action.payload
    },
    createTrip(state, action) {
      state.push(action.payload)
    }
  }
})

export const { setTrips, createTrip } = tripSlice.actions

export const initializeTrips = () => {
  return async (dispatch) => {
    const trips = await tripService.getAll()
    dispatch(setTrips(trips))
  }
}

export const addNewTrip = (trip) => {
  return async (dispatch) => {
    const returnedTrip = await tripService.create(trip)
    dispatch(createTrip(returnedTrip))
    return returnedTrip
  }
}

export default tripSlice.reducer
