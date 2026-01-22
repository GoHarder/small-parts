function splitDate(d: Date) {
  const date = new Date(d)
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDay()
  const dayNum = date.getDate()
  return { year, month, day, dayNum }
}

function getMonday(d: Date) {
  const { year, month, day } = splitDate(d)
  const diff = new Date(d).getDate() - day + (day === 0 ? -6 : 1) // Adjust for Sunday
  return new Date(year, month, diff)
}

function getFriday(d: Date) {
  const monday = new Date(getMonday(d))
  const { year, month, dayNum } = splitDate(monday)
  return new Date(year, month, dayNum + 4, 12)
}

// Example usage:
const monday = getMonday(new Date())
const friday = getFriday(new Date())
console.log(monday) // Outputs the date of Monday of the current week
console.log(friday) // Outputs the date of Monday of the current week

// const date = new Date(2026, 0, 19)
// console.log(date)
