const formatDate = (date) => {
  const d = new Date(date)
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`
}

const getTripDateRange = (locations) => {
  if (!locations || locations.length === 0) return ''

  const startDates = locations.map(l => new Date(l.startDate))
  const endDates = locations.map(l => new Date(l.endDate))

  const earliest = new Date(Math.min(...startDates))
  const latest = new Date(Math.max(...endDates))

  return `${formatDate(earliest)} - ${formatDate(latest)}`
}

export default { getTripDateRange }
