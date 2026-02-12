import { useField } from '../hooks'
import { useNavigate } from 'react-router-dom'
import userService from '../services/users'

const SignUpForm = () => {
  const navigate = useNavigate()

  const username = useField('text')
  const password = useField('password')

  const createUser = (event) => {
    event.preventDefault()
    userService
      .create({
        username: username.value,
        password: password.value
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
            <input {...username} />
          </label>
        </div>
        <div>
          <label>
            Password
            <input {...password} />
          </label>
        </div>
        <button onClick={cancel}>Cancel</button>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}


export default SignUpForm