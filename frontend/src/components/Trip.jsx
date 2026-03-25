import { useParams, useNavigate } from 'react-router-dom'
import TripSummary from './TripSummary'
import { useDispatch, useSelector } from 'react-redux'
import { deleteTrip } from '../reducers/tripReducer'
import { showNotification } from '../reducers/notificationReducer'
import { useRef } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const Trip = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const tripRef = useRef()
  const { id } = useParams()
  const trip = useSelector(state =>
    state.trips.find(t => t.id === id)
  )

  if (!trip) return <p>Trip not found</p>

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

      <div className='tripDetailsButtons'>
        <button type="button" onClick={editTrip}>
          Edit
        </button>
        <button type="button" onClick={handleDeleteTrip}>
          Delete trip
        </button>
        <button type="button" onClick={handleDownload}>
          Download
        </button>
      </div>

      <div ref={tripRef}>
        <h2>{trip.title}</h2>

        <TripSummary trip={trip} />

        <div className='locationsDiv'>
          {trip.locations?.length === 0 && <p>No locations yet. Click "edit" to add a location.</p>}
          {trip.locations && trip.locations.map(location => (
            <div className='locationDiv' style={{ backgroundColor: location.backgroundColor }} key={location.id}>
              <div className='locationTitleDiv'>{location.city}, {location.country}</div>
              {location.notes && (
                <div className='locationDetailDiv'>
                  Notes: {location.notes}
                </div>
              )}
              <div className='locationDetailDiv'>From: {formatDate(location.startDate)}</div>
              <div className='locationDetailDiv'>To: {formatDate(location.startDate)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Trip
