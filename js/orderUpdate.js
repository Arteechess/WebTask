const updateCheckFood = document.getElementById('update-check-food')
const updateCheckTrip = document.getElementById('update-check-trip')
const updateTripPeopleCount = document.getElementById('update-trip-people-count')

const updateTripDate = document.getElementById('update-trip-date')
const updateTripDuration = document.getElementById('update-trip-duration')
const updateTripTime = document.getElementById('update-trip-time')

let isThisDayOff = false
let isItMorning = false
let isItEvening = false
let numberOfVisitors = 0
let hoursNumber = 0

let updateOrderId = 0

let guidePrice = 0

updateCheckFood.addEventListener('change', () => {
    updatePrice()
})

updateCheckTrip.addEventListener('change', () => {
    updatePrice()
})

updateTripPeopleCount.addEventListener('change', () => {
    console.log(currentPrice)
    if (updateTripPeopleCount.value < 1) {
        alert('Количество людей должно быть больше 0')
        updateTripPeopleCount.value = 1
    }
    if (updateTripPeopleCount.value > 20) {
        alert('Количество людей должно не превышать 20')
        updateTripPeopleCount.value = 20
    }

    numberOfVisitors = Number(updateTripPeopleCount.value)
    updatePrice()
})

updateTripDate.addEventListener('change', () => {
    const date = new Date(updateTripDate.value)

    if (!isThisDayOff && (date.getDay() === 0 || date.getDay() === 6)) {
        isThisDayOff = true
        updatePrice()
    }
    if (isThisDayOff && date.getDay() !== 0 && date.getDay() !== 6) {
        isThisDayOff = false
        updatePrice()
    }
})

updateTripTime.addEventListener('change', () => {
    if (updateTripTime.value < '09:00' || updateTripTime.value > '23:00') {
        alert('Время экскурсии должно быть в диапазоне от 09:00 до 23:00')
        updateTripTime.value = '09:00'
    }
    if (!isItMorning && (updateTripTime.value >= '09:00' && updateTripTime.value <= '12:00')) {
        isItMorning = true
        document.getElementById('update-total-modal-price').innerText = Number(document.getElementById('update-total-modal-price').innerText) + 400
    }
    if (isItMorning && (updateTripTime.value < '09:00' || updateTripTime.value > '12:00')) {
        isItMorning = false
        document.getElementById('update-total-modal-price').innerText = Number(document.getElementById('update-total-modal-price').innerText) - 400
    }
    if (!isItEvening && (updateTripTime.value >= '20:00' && updateTripTime.value <= '23:00')) {
        isItEvening = true
        document.getElementById('update-total-modal-price').innerText = Number(document.getElementById('update-total-modal-price').innerText) + 1000
    }
    if (isItEvening && (updateTripTime.value < '20:00' || updateTripTime.value > '23:00')) {
        isItEvening = false
        document.getElementById('update-total-modal-price').innerText = Number(document.getElementById('update-total-modal-price').innerText) - 1000
    }
})

updateTripDuration.addEventListener('change', () => {
    hoursNumber = Number(updateTripDuration.value)
    updatePrice()
})

function updateOrder(id, route_id, route_name) {
    const url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/' + id + '?api_key=' + API_KEY

    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateOrderId = data.id

            const guideUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/guides/' + data.guide_id + '?api_key=' + API_KEY
            fetch(guideUrl)
                .then(response => response.json())
                .then(guideData => {
                    guidePrice = guideData.pricePerHour
                    displayUpdateOrder(data, guideData, route_id, route_name)
                })
        })
}

function displayUpdateOrder(data, guideData, route_id, route_name) {
    document.getElementById('update-guide-name').innerText = guideData.name
    document.getElementById('update-route-name').innerText = route_name

    document.getElementById('update-trip-date').value = data.date
    const date = new Date(data.date)
    isThisDayOff = date.getDay() === 0 || date.getDay() === 6

    document.getElementById('update-trip-time').value = data.time
    isItMorning = data.time >= '09:00' && data.time <= '12:00'
    isItEvening = data.time >= '20:00' && data.time <= '23:00'

    document.getElementById('update-trip-duration').value = data.duration
    hoursNumber = data.duration

    document.getElementById('update-trip-people-count').value = data.persons
    numberOfVisitors = data.persons

    document.getElementById('update-check-food').checked = data.optionFirst
    document.getElementById('update-check-trip').checked = data.optionSecond
    updatePrice()

    currentPrice = getUpdatedPrice()
}

function updateOrderRequest() {
    console.log(updateOrderId)
    const url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/' + updateOrderId + '?api_key=' + API_KEY
    const formdata = new FormData()
    formdata.append('date', String(document.getElementById('update-trip-date').value))
    formdata.append('time', String(document.getElementById('update-trip-time').value))
    formdata.append('duration', String(document.getElementById('update-trip-duration').value))
    formdata.append('optionFirst', String(Number(document.getElementById('update-check-food').checked)))
    formdata.append('optionSecond', String(Number(document.getElementById('update-check-trip').checked)))
    formdata.append('persons', String(document.getElementById('update-trip-people-count').value))
    formdata.append('price', String(Math.round(Number(document.getElementById('update-total-modal-price').innerText))))

    formdata.forEach((value, key) => {
        console.log(key + ' ' + value)
    })

    fetch(url, {
        method: 'PUT',
        body: formdata
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Произошла ошибка')
            }
            return response.json()
        })
        .then(data => {
                console.log(data)
                window.location.href = 'account.html'
            }
        )
}

const getUpdatedPrice = () => {
    let price = guidePrice

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

    if (updateCheckTrip.checked) {
        if (isThisDayOff)
            price *= 1.25
        else
            price *= 1.3
    }
    if (updateCheckFood.checked) {
        if (numberOfVisitors === 0)
            numberOfVisitors = 1

        price += 1000 * numberOfVisitors
    }

    return Math.round(price)
}

function updatePrice() {
    document.getElementById('update-total-modal-price').innerText = getUpdatedPrice()
}