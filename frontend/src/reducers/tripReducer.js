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
    },
    removeTrip(state, action) {
      return state.filter(t => t.id !== action.payload)
    },
    updateTrip(state, action) {
      const updated = action.payload
      return state.map(t => t.id === updated.id ? updated : t)
    }
  }
})

export const { setTrips, createTrip, removeTrip, updateTrip } = tripSlice.actions

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

export const deleteTrip = (tripId) => {
  return async dispatch => {
    await tripService.deleteTrip(tripId)
    dispatch(removeTrip(tripId))
  }
}

export const editTrip = (trip) => {
  return async dispatch => {
    const returnedTrip = await tripService.update(trip)
    dispatch(updateTrip(returnedTrip))
    return returnedTrip
  }
}

export default tripSlice.reducer
