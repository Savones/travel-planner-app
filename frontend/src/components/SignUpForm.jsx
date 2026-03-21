import { useField } from '../hooks'
import { useNavigate } from 'react-router-dom'
import userService from '../services/users'
import { showNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'

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
      dispatch(showNotification(`Username invalid. Username has to have 3-20 characters.`, 5000))
      return
    }

    if (password.value.length < 8 || password.value.length > 15) {
      dispatch(showNotification(`Password invalid. Password has to have 8-15 characters.`, 5000))
      return
    }

    try {
      await userService.create({
        username: username.value,
        password: password.value
      })

      dispatch(showNotification(`Created user "${username.value}"`, 5000))
      navigate('/login')

    } catch (error) {
      if (error.response?.data?.error.includes('duplicate')) {
        dispatch(showNotification('Username already exists', 5000))
      } else {
        dispatch(showNotification('Failed to create user', 5000))
      }
    }
  }

  const cancel = (event) => {
    event.preventDefault()
    navigate('/login')
  }

  return (
    <div className='loginDiv'>
      <h2>Sign Up</h2>
      <form className='loginForm' onSubmit={createUser}>
        <div>
          <label>
            Username
            <input {...usernameInput} />
          </label>
        </div>
        <div>
          <label>
            Password
            <input {...passwordInput} />
          </label>
        </div>
        <div className='loginButtons'>
          <button onClick={cancel}>Cancel</button>
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  )
}


export default SignUpForm