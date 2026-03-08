const TripBudget = ({ trip }) => {
  if (trip.budget) {
    return (
      <div className="budgetDiv">
        <h3>Budget</h3>
        <div>Total budget: {trip.budget}</div>
      </div>
    )
  } else {
    return (
      <div>No bugdet.</div>
    )
  }
}

export default TripBudget