import { Link } from 'react-router-dom'

const Menu = () => {
  return (
    <div>
      <Link to="/">My trips</Link>
      &nbsp; &nbsp;
      <Link to="/create">Create</Link>
    </div>
  )
}

export default Menu