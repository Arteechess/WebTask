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
    updatePrice()
})

checkboxTrip.addEventListener('change', () => {
    updatePrice()
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
    updatePrice()
})

tripDate.addEventListener('change', () => {
    const date = new Date(tripDate.value)
    if (!isThisDayOff && (date.getDay() === 6 || date.getDay() === 0)) {
        isThisDayOff = true
        updatePrice()
    }
    if (isThisDayOff && date.getDay() !== 6 && date.getDay() !== 0) {
        isThisDayOff = false
        updatePrice()
    }
})

tripTime.addEventListener('change', () => {
    if (tripTime.value < '09:00' || tripTime.value > '23:00') {
        alert('Время должно быть в диапазоне от 09:00 до 23:00')
        tripTime.value = '09:00'
    }

    if (!isItMorning && (tripTime.value >= '09:00' && tripTime.value <= '12:00')) {
        isItMorning = true
        updatePrice()
    }
    if (isItMorning && (tripTime.value < '09:00' || tripTime.value > '12:00')) {
        isItMorning = false
        updatePrice()
    }
    if (!isItEvening && (tripTime.value >= '20:00' && tripTime.value <= '23:00')) {
        isItEvening = true
        updatePrice()
    }
    if (isItEvening && (tripTime.value < '20:00' || tripTime.value > '23:00')) {
        isItEvening = false
        updatePrice()
    }
})

tripDuration.addEventListener('change', () => {
    hoursNumber = Number(tripDuration.value)
    updatePrice()
})

function orderRegistration() {
    const url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=' + API_KEY

    const formdata = new FormData()
    formdata.append('date', String(tripDate.value))
    formdata.append('duration', String(tripDuration.value))
    formdata.append('guide_id', String(currentGuide))
    formdata.append('optionFirst', String(Number(checkboxFood.checked)))
    formdata.append('optionSecond', String(Number(checkboxTrip.checked)))
    formdata.append('persons', String(tripPeopleCount.value))
    formdata.append('price', String(Math.round(getPrice())))
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

    if (checkboxTrip.checked) {
        if (isThisDayOff)
            price *= 1.25
        else
            price *= 1.3
    }
    if (checkboxFood.checked) {
        if (numberOfVisitors === 0)
            numberOfVisitors = 1

        price += 1000 * numberOfVisitors
    }

    return Math.round(price)
}

function updatePrice() {
    document.getElementById('total-modal-price').innerText = getPrice()
}
