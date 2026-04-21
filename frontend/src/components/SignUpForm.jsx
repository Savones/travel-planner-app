import { useField } from '../hooks'
import { useNavigate } from 'react-router-dom'
import userService from '../services/users'
import { showNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { createNewUser } from '../reducers/usersReducer'

const SignUpForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const username = useField('text')
  const password = useField('password')

  const { setValue: setUsernameValue, ...usernameInput } = username
  const { setValue: setPasswordValue, ...passwordInput } = password

  const createUser = async (event) => {
    event.preventDefault()

    if (username.value.length < 3 || username.value.length > 20) {
      dispatch(showNotification(`Username invalid. Username has to have 3-20 characters.`, 5000, 'info'))
      return
    }

    if (password.value.length < 8 || password.value.length > 15) {
      dispatch(showNotification(`Password invalid. Password has to have 8-15 characters.`, 5000, 'info'))
      return
    }

    try {
      const createdUser = {
        username: username.value,
        password: password.value
      }

      const returnedUser = await dispatch(createNewUser(createdUser))
      dispatch(showNotification(`Created user "${username.value}"`, 5000, 'success'))
      navigate('/login')

    } catch (error) {
      dispatch(showNotification(`Error: ${error.response.data.error}`, 5000, 'error'))
    }
  }

  const cancel = (event) => {
    event.preventDefault()
    navigate('/login')
  }

  return (
    <div className='editOuterSection'>
      <h2>Sign Up</h2>
      <form className='editSection' onSubmit={createUser}>
        <div className='editRow'>
          <label>
            Username
          </label>
          <input {...usernameInput} />

        </div>
        <div className='editRow'>
          <label>
            Password
          </label>
          <input {...passwordInput} />

        </div>
        <div className='editRow'>
          <button type="submit">Create</button>
          <button className='cancelButton' onClick={cancel}>Cancel</button>
        </div>
      </form>
    </div>
  )
}


export default SignUpForm