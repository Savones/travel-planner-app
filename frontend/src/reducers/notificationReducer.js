import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

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
    dispatch(notify(content))
    setTimeout(() => { dispatch(notify('')) }, timeShown)
  }
}

export default notificationSlice.reducer