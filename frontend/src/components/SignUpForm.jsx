import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import userService from '../services/users'

const SignUpForm = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const createUser = (event) => {
    event.preventDefault()
    userService
      .create({
        username: username,
        password: password
      })
    navigate('/login')
  }

  const cancel = (event) => {
    event.preventDefault()
    navigate('/login')
  }

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={createUser}>
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
        <button onClick={cancel}>Cancel</button>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}


export default SignUpForm