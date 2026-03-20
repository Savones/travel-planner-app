import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (notification === '') {
    return <div></div>
  }

  return <div className='notificationDiv'>{notification}</div>
}

export default Notification