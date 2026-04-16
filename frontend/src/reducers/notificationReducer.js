import { createSlice } from '@reduxjs/toolkit'

const initialState = { message: '', type: 'info' }

let timeoutId = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notify(state, action) {
      return action.payload
    }
  }
})

export const { notify } = notificationSlice.actions

export const showNotification = (content, timeShown, type) => {
  return async (dispatch) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    dispatch(notify({ message: content, type }))

    timeoutId = setTimeout(() => {
      dispatch(notify({ message: '', type: 'info' }))
    }, timeShown)
  }
}

export default notificationSlice.reducer
