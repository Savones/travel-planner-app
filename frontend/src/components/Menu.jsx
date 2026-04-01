import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { showNotification } from '../reducers/notificationReducer'

const Menu = ({ handleLogout }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logout = () => {
    handleLogout()
    dispatch(showNotification(`User has logged out.`, 5000))
    navigate('/login')
  }

  return (
    <div className="menuLinks">
      <Link to="/">My trips</Link>
      <Link to="/create">Create</Link>
      <button onClick={logout}>
        Logout
      </button>
    </div>
  )
}

export default Menu
