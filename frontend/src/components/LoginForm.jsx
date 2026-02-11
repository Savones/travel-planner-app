import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import loginService from '../services/users'

// To-do: Make login the correct way using login service not users

const LoginForm = ({ setUser }) => {
  const navigator = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async event => {
    event.preventDefault()
    const users = await loginService.getAll()
    const user = users.find(
      u => u.username === username && u.password === password
    )
    if (user) {
      console.log("Login successful:", user)
      window.localStorage.setItem("loggedUser", JSON.stringify(user.username))
      setUser(user.username)
      navigator('/')
    } else {
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
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}


export default LoginForm