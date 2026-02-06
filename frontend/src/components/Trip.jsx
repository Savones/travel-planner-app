const Trip = ({ id, country, startDate, endDate }) => {
  return (
    <div>
      <h2 key={id}>{country}</h2>
      <p>{startDate} - {endDate}</p>
    </div>
  )
}

export default Trip