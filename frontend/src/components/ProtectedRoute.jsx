import { Navigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { showNotification } from '../reducers/notificationReducer'

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    const dispatch = useDispatch()
    dispatch(showNotification('Redirected to login page.', 5000))
    return <Navigate to="/login" />
  }
  return children
}

export default ProtectedRoute