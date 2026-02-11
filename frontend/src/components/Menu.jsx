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
      &nbsp;&nbsp;
      <Link to="/create">Create</Link>
      &nbsp;&nbsp;
      <button onClick={logout} style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, color: 'blue', textDecoration: 'underline' }}>
        Logout
      </button>
    </div>
  )
}

export default Menu
