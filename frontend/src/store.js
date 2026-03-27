import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userReducer'
import tripReducer from './reducers/tripReducer'
import notificationReducer from './reducers/notificationReducer'
import usersReducer from './reducers/usersReducer'

const store = configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    trips: tripReducer,
    notification: notificationReducer
  }
})

export default store