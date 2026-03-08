import { useField } from '../hooks'
import { useParams, useNavigate } from 'react-router-dom'

const BudgetForm = ({ updateTrip, trips }) => {
  const navigate = useNavigate()
  const budget = useField('number')
  const { id } = useParams()
  const trip = trips.find(n => n.id == id)

  const handleSubmit = (event) => {
    event.preventDefault()
    updateTrip({
      ...trip,
      budget: budget.value
    })
    navigate(`/trips/${trip.id}`)
  }

  return (
    <div className='createBudgetDiv'>
      <h3>Make a budget</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Total budget</label>
          <input {...budget} />
        </div>
        <input type='submit' value='Add' />
      </form>
    </div>
  )
}

export default BudgetForm