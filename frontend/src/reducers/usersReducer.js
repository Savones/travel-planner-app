import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
    createUser(state, action) {
      state.push(action.payload)
    }
  }
})

export const { setUsers, createUser } = usersSlice.actions

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll()
    dispatch(setUsers(users))
  }
}

export const createNewUser = (user) => {
  return async (dispatch) => {
    const returnedUser = await userService.create(user)
    dispatch(createUser(returnedUser))
    return returnedUser
  }
}

export default usersSlice.reducer