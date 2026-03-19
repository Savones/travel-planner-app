import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userReducer'
import tripReducer from './reducers/tripReducer'

const store = configureStore({
  reducer: {
    user: userReducer,
    trips: tripReducer
  }
})

export default store