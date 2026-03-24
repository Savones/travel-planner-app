import { useField } from '../hooks'
import { useNavigate } from 'react-router-dom'
import loginService from '../services/users'
import tripService from '../services/trips'
import { useDispatch } from 'react-redux'
import { setUser } from '../reducers/userReducer'
import { showNotification } from '../reducers/notificationReducer'

const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const username = useField('text')
  const { setValue: setUsername, ...usernameInput } = username

  const password = useField('password')
  const { setValue: setPassword, ...passwordInput } = password

  const changeView = (event) => {
    event.preventDefault()
    navigate('/signup')
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username: username.value,
        password: password.value
      })
      window.localStorage.setItem("loggedUser", JSON.stringify(user))
      dispatch(setUser(user))
      tripService.setToken(user.token)
      dispatch(showNotification(`User "${user.username}" has logged in.`, 5000))
      navigate('/')
    } catch {
      dispatch(showNotification(`Username or password incorrect.`, 5000))
    }
  }
  return (
    <div className='loginDiv'>
      <h2>Log in</h2>
      <form className='loginForm' onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
          <button onClick={changeView}>Sign up</button>
        </div>
      </form>
    </div>
  )
}


export default LoginForm