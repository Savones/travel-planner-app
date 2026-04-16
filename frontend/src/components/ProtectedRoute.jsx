import { useEffect } from 'react'
import { useDispatch } from "react-redux"
import { showNotification } from '../reducers/notificationReducer'
import { useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children }) => {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      dispatch(showNotification('Redirected to login page.', 5000))
    }
  }, [user, navigate])

  if (!user) {
    return null
  }
  return children
}

export default ProtectedRoute