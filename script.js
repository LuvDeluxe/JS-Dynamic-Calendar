import {
  format,
  getUnixTime,
  fromUnixTime,
  addMonths,
  subMonths,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  addWeeks,
  addDays,
  isToday
} from "date-fns"

const datePickerButton = document.querySelector('.date-picker-button')
const currentMonthHeading = document.querySelector('.current-month')
const nextMonthButton = document.querySelector('.next-month-button')
const previousMonthButton = document.querySelector('.prev-month-button')
const datePicker = document.querySelector('.date-picker')
const datePickerContainer = document.querySelector('.date-picker-grid-dates')

let currentDate = new Date()
let selectedDate = null


datePickerButton.addEventListener('click', () => {
  datePicker.classList.toggle('show')
  renderDates(fromUnixTime(getCurrentDate()))
})

function getCurrentDate() {
  datePickerButton.dataset.timeNow = getUnixTime(currentDate)
  setCurrentDate()
  return datePickerButton.dataset.timeNow
}

function setCurrentDate() {
  const timeNow = fromUnixTime(parseInt(datePickerButton.dataset.timeNow))
  currentDate = timeNow
  datePickerButton.textContent = format(timeNow, 'MMMM do, yyyy')
  currentMonthHeading.textContent = format(timeNow, 'MMMM - yyyy')
}

previousMonthButton.addEventListener('click', () => {
  currentDate = subMonths(currentDate, 1)
  const formattedDate = format(currentDate, 'MMMM - yyyy')
  currentMonthHeading.textContent = formattedDate
  renderDates(currentDate)
});

nextMonthButton.addEventListener('click', () => {
  currentDate = addMonths(currentDate, 1)
  const formattedDate = format(currentDate, 'MMMM - yyyy')
  currentMonthHeading.textContent = formattedDate
  renderDates(currentDate)
});

function renderDates(currentDate) {
  const start = startOfMonth(currentDate)
  const end = endOfMonth(currentDate)
  const previousWeekStart = startOfWeek(start)
  const nextWeekStart = startOfWeek(addWeeks(end, 1))

  datePickerContainer.innerHTML = ''

  for (let date = previousWeekStart; date <= nextWeekStart; date = addDays(date, 1)) {
    const listItem = document.createElement('li')
    const formattedDate = format(date, 'd')
    listItem.textContent = formattedDate
    datePickerContainer.appendChild(listItem)
    listItem.style.cursor = "pointer"

    if (date < start || date > end) {
      listItem.classList.add('date-picker-other-month-date')
    }

    const formattedChosenDate = format(date, 'MMM do, yyy')
    const storedDate = localStorage.getItem('selectedDate')

    if (storedDate === formattedChosenDate) {
      listItem.classList.add('selected')
      selectedDate = listItem
    }

    if (isToday(date) && (selectedDate === null && format(date, 'MMM do, yyyy') === format(currentDate, 'MMM do, yyyy'))) {
      listItem.classList.add('selected')
      selectedDate = listItem
    }

    listItem.addEventListener('click', () => {
      datePickerButton.textContent = formattedChosenDate

      if (selectedDate !== null) {
        selectedDate.classList.remove('selected')
      }

      listItem.classList.add('selected')
      selectedDate = listItem
      localStorage.setItem('selectedDate', formattedChosenDate)
      datePicker.classList.toggle('show')
    })
  }
}

getCurrentDate()
