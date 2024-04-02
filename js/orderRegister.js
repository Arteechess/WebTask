const guideModalName = document.getElementById('guide-name')
const routeModalName = document.getElementById('route-modal-name')
const tripDate = document.getElementById('trip-date')
const tripTime = document.getElementById('trip-time')
const tripDuration = document.getElementById('trip-duration')
const tripPeopleCount = document.getElementById('trip-people-count')
const checkboxFood = document.getElementById('check-food')
const checkboxTrip = document.getElementById('check-trip')

let isThisDayOff = false
let isItMorning = false
let isItEvening = false
let numberOfVisitors = 0
let hoursNumber = 0

let guideOrderPrice = 0

checkboxFood.addEventListener('change', () => {
  console.log(getPriceWithOption())
  document.getElementById('total-modal-price').innerText = getPriceWithOption()
})

checkboxTrip.addEventListener('change', () => {
  console.log(getPriceWithOption())
  document.getElementById('total-modal-price').innerText = getPriceWithOption()
})

tripPeopleCount.addEventListener('change', () => {
  if (tripPeopleCount.value < 1) {
    alert('Количество людей должно быть больше 0')
    tripPeopleCount.value = 1
  }
  if (tripPeopleCount.value > 20) {
    alert('Количество людей должно не превышать 20')
    tripPeopleCount.value = 20
  }

  numberOfVisitors = Number(tripPeopleCount.value)
  document.getElementById('total-modal-price').innerText = getPriceWithOption()
})

tripDate.addEventListener('change', () => {
  const date = new Date(tripDate.value)
  if (!isThisDayOff && (date.getDay() === 6 || date.getDay() === 0)) {
    isThisDayOff = true
    document.getElementById('total-modal-price').innerText = getPriceWithOption()
  }
  if (isThisDayOff && date.getDay() !== 6 && date.getDay() !== 0) {
    isThisDayOff = false
    document.getElementById('total-modal-price').innerText = getPriceWithOption()
  }
})

tripTime.addEventListener('change', () => {
  if (tripTime.value < '09:00' || tripTime.value > '23:00') {
    alert('Время должно быть в диапазоне от 09:00 до 23:00')
    tripTime.value = '09:00'
  }

  if (!isItMorning && (tripTime.value >= '09:00' && tripTime.value <= '12:00')) {
    isItMorning = true
    document.getElementById('total-modal-price').innerText = getPriceWithOption()
  }
  if (isItMorning && (tripTime.value < '09:00' || tripTime.value > '12:00')) {
    isItMorning = false
    document.getElementById('total-modal-price').innerText = getPriceWithOption()
  }
  if (!isItEvening && (tripTime.value >= '20:00' && tripTime.value <= '23:00')) {
    isItEvening = true
    document.getElementById('total-modal-price').innerText = getPriceWithOption()
  }
  if (isItEvening && (tripTime.value < '20:00' || tripTime.value > '23:00')) {
    isItEvening = false
    document.getElementById('total-modal-price').innerText = getPriceWithOption()
  }
})

tripDuration.addEventListener('change', () => {
  hoursNumber = Number(tripDuration.value)
  document.getElementById('total-modal-price').innerText = getPriceWithOption()
})

function orderRegistration () {
  const url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=' + API_KEY

  const formdata = new FormData()
  formdata.append('date', String(tripDate.value))
  formdata.append('duration', String(tripDuration.value))
  formdata.append('guide_id', String(currentGuide))
  formdata.append('optionFirst', String(Number(checkboxFood.checked)))
  formdata.append('optionSecond', String(Number(checkboxTrip.checked)))
  formdata.append('persons', String(tripPeopleCount.value))
  formdata.append('price', String(Math.round(getPriceWithOption())))
  formdata.append('route_id', String(currentRoute))
  formdata.append('time', String(tripTime.value))

  formdata.forEach((value, key) => {
    console.log(key + ' ' + value)
  })

  const requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  }

  fetch(url, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Произошла ошибка' + response.status)
      }
      return response.json()
    })
    .then(data => {
      // close modal
      console.log(data)
      document.getElementById('close-modal').click()
    })
    .catch(error => {
      console.log(error)
    })
}

const getPrice = () => {
  let price = guideOrderPrice

  if (hoursNumber !== 0) {
    price *= hoursNumber
  }
  if (isThisDayOff) {
    price *= 1.5
  }
  if (isItMorning) {
    price += 400
  }
  if (isItEvening) {
    price += 1000
  }

  if (numberOfVisitors >= 5 && numberOfVisitors < 10) {
    price += 1000
  }
  if (numberOfVisitors >= 10) {
    price += 1500
  }

  return price
}

const getPriceWithOption = () => {
  let price = getPrice()

  if (checkboxTrip.checked) {
    price *= 1.5
  }
  if (checkboxFood.checked) {
    price += 1000 * numberOfVisitors
  }

  console.log(guideOrderPrice, getPrice(), price)

  return Math.round(price)
}
