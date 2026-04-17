import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { showNotification } from '../reducers/notificationReducer'

const Menu = ({ handleLogout }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logout = () => {
    handleLogout()
    dispatch(showNotification('User has logged out.', 5000, 'info'))
    navigate('/login')
  }

  return (
    <div className="menuLinks">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? 'activeButton' : ''
        }
      >
        My trips
      </NavLink>

      <NavLink
        to="/create"
        className={({ isActive }) =>
          isActive ? 'activeButton' : ''
        }
      >
        Create
      </NavLink>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  )
}

export default Menu