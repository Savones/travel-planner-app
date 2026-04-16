import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (notification.message == '') {
    return <div></div>
  }

  return (
    <div className={`notificationDiv ${notification.type}`}>
      <span>{notification.message}</span>
    </div>
  )
}

export default Notification