import { useNavigate, Link } from 'react-router-dom'

const Menu = ({ handleLogout }) => {
  const navigate = useNavigate()

  const logout = () => {
    handleLogout()
    navigate('/login')
  }

  return (
    <div>
      <Link to="/">My trips</Link>
      <Link to="/create">Create</Link>
      <button onClick={logout}>
        Logout
      </button>
    </div>
  )
}

export default Menu
