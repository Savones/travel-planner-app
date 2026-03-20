import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

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

export const showNotification = (content, timeShown) => {
  return async (dispatch) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    dispatch(notify(content))

    timeoutId = setTimeout(() => {
      dispatch(notify(''))
    }, timeShown)
  }
}

export default notificationSlice.reducer
