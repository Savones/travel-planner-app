import { useField } from '../hooks'
import { useNavigate } from 'react-router-dom'
import loginService from '../services/users'

// To-do: Make login the correct way using login service not users

const LoginForm = ({ setUser }) => {
  const navigate = useNavigate()

  const username = useField('text')
  const password = useField('password')

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
      console.log("Login successful:", user)
      window.localStorage.setItem("loggedUser", JSON.stringify(user))
      setUser(user)
      navigate('/')
    } catch {
      console.log("Wrong credentials")
    }
  }
  return (
    <div>
      <h2>Log in</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            Username
            <input {...username} />
          </label>
        </div>
        <div>
          <label>
            Password
            <input {...password} />
          </label>
        </div>
        <button type="submit">Login</button>
        <button onClick={changeView}>Sign up</button>
      </form>
    </div>
  )
}


export default LoginForm