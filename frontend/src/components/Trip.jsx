import { useParams, useNavigate } from 'react-router-dom'
import TripSummary from './TripSummary'
import { useDispatch, useSelector } from 'react-redux'
import { deleteTrip } from '../reducers/tripReducer'
import { showNotification } from '../reducers/notificationReducer'
import { useRef } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const Trip = () => {
  const image = '/images/nz.jpg'

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const tripRef = useRef()
  const { id } = useParams()
  const trip = useSelector(state =>
    state.trips.find(t => t.id === id)
  )
  const user = useSelector(state => state.user)
  if (!trip) return <p>Trip not found</p>

  const role =
    trip.user.id === user.id
      ? 'owner'
      : trip.users.find(u => {
        const id = u.user?.id || u.user?._id || u.user
        return id === user.id
      })?.role

  const editTrip = (event) => {
    event.preventDefault()
    navigate(`/trips/${trip.id}/edit`)
  }

  const handleDeleteTrip = async (event) => {
    event.preventDefault()
    const confirmation = window.confirm(`Delete trip "${trip.title}"?`)
    if (!confirmation) {
      return
    }

    try {
      await dispatch(deleteTrip(id))
      dispatch(showNotification(`Trip "${trip.title}" has been deleted.`, 5000))
      navigate(`/`)

    } catch (error) {
      dispatch(showNotification(`Failed to delete trip "${trip.title}". Error: ${error.response.data.error}`))
    }
  }

  const handleDownload = async () => {
    try {
      const element = tripRef.current
      const canvas = await html2canvas(element, {
        scale: 2
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')

      const margin = 10
      const imgWidth = 210 - margin * 2
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${trip.title}.pdf`)

    } catch (error) {
      dispatch(showNotification(`Download failed.`, 5000))
    }
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('fi-FI')

  return (
    <div className='tripPageDiv'>
      <div ref={tripRef}>
        <div className="tripHeading">
          <img src={image} alt={trip.title} />
          <div className="tripOverlay">
            <h1>{trip.title}</h1>
            <div className="tripButtons">
              {(role === 'owner' || role === 'editor') && (
                <button onClick={editTrip}>Edit</button>
              )}

              {role === 'owner' && (
                <button onClick={handleDeleteTrip}>Delete</button>
              )}

              <button onClick={handleDownload}>Download</button>
            </div>
          </div>
        </div>

        <div className='tripContent'>
          <div className='tripMain'>
            <div className='locationsDiv'>
              <h2>Itinerary</h2>
              {trip.locations?.length === 0 && <p>No locations yet. Click "edit" to add a location.</p>}
              {trip.locations.map(location => (
                <div className='locationDiv' key={location.id} style={{ borderColor: location.backgroundColor }}>
                  <div className='locationTitleDiv'>{location.city}, {location.country}</div>
                  <div className='locationDetailDiv'>
                    {formatDate(location.startDate)} - {formatDate(location.endDate)}
                  </div>
                  {location.notes && (
                    <div className='locationDetailDiv'>Notes: {location.notes}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className='tripSidebar'>
            <TripSummary trip={trip} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Trip
