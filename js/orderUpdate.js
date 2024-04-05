const updateCheckFood = document.getElementById('update-check-food');
const updateCheckTrip = document.getElementById('update-check-trip');
const updateTripPeopleCount = document.getElementById('update-trip-people-count');
const updateTripDate = document.getElementById('update-trip-date');
const updateTripDuration = document.getElementById('update-trip-duration');
const updateTripTime = document.getElementById('update-trip-time');

let isThisDayOff = false;
let isItMorning = false;
let isItEvening = false;
let numberOfVisitors = 0;
let hoursNumber = 0;
let updateOrderId = 0;
let guidePrice = 0;

updateCheckFood.addEventListener('change', updatePrice);
updateCheckTrip.addEventListener('change', updatePrice);
updateTripPeopleCount.addEventListener('change', handlePeopleCountChange);
updateTripDate.addEventListener('change', handleDateChange);
updateTripTime.addEventListener('change', handleTimeChange);
updateTripDuration.addEventListener('change', handleDurationChange);

function handlePeopleCountChange() {
    if (updateTripPeopleCount.value < 1) {
        alert('Количество людей должно быть больше 0');
        updateTripPeopleCount.value = 1;
    }
    if (updateTripPeopleCount.value > 20) {
        alert('Количество людей должно не превышать 20');
        updateTripPeopleCount.value = 20;
    }
    numberOfVisitors = Number(updateTripPeopleCount.value);
    updatePrice();
}

function handleDateChange() {
    const date = new Date(updateTripDate.value);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (isThisDayOff !== isWeekend) {
        isThisDayOff = isWeekend;
        updatePrice();
    }
}

function handleTimeChange() {
    const time = updateTripTime.value;
    isItMorning = time >= '09:00' && time <= '12:00';
    isItEvening = time >= '20:00' && time <= '23:00';
    updatePrice();
}

function handleDurationChange() {
    hoursNumber = Number(updateTripDuration.value);
    updatePrice();
}

function updateOrder(id, route_id, route_name) {
    const url = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/${id}?api_key=${API_KEY}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateOrderId = data.id;
            const guideUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/guides/${data.guide_id}?api_key=${API_KEY}`;
            fetch(guideUrl)
                .then(response => response.json())
                .then(guideData => {
                    guidePrice = guideData.pricePerHour;
                    displayUpdateOrder(data, guideData, route_id, route_name);
                });
        });
}

function displayUpdateOrder(data, guideData, route_id, route_name) {
    document.getElementById('update-guide-name').innerText = guideData.name;
    document.getElementById('update-route-name').innerText = route_name;
    updateTripDate.value = data.date;
    updateTripTime.value = data.time;
    updateTripDuration.value = data.duration;
    updateTripPeopleCount.value = data.persons;
    updateCheckFood.checked = data.optionFirst;
    updateCheckTrip.checked = data.optionSecond;

    handleDateChange();
    handleTimeChange();
    handleDurationChange();
    handlePeopleCountChange();
}

function updateOrderRequest() {
    const url = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/${updateOrderId}?api_key=${API_KEY}`;
    const formData = new FormData();
    formData.append('date', updateTripDate.value);
    formData.append('time', updateTripTime.value);
    formData.append('duration', updateTripDuration.value);
    formData.append('optionFirst', Number(updateCheckFood.checked));
    formData.append('optionSecond', Number(updateCheckTrip.checked));
    formData.append('persons', updateTripPeopleCount.value);
    formData.append('price', Math.round(Number(document.getElementById('update-total-modal-price').innerText)));

    fetch(url, {
        method: 'PUT',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Произошла ошибка');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            window.location.href = 'account.html';
        });
}

const getUpdatedPrice = () => {
    let price = guidePrice;
    if (hoursNumber !== 0)
        price *= hoursNumber

    if (isThisDayOff) price *= 1.5;
    if (isItMorning) price += 400;
    if (isItEvening) price += 1000;
    if (numberOfVisitors >= 5 && numberOfVisitors < 10) price += 1000;
    if (numberOfVisitors >= 10) price += 1500;
    if (updateCheckTrip.checked) price *= isThisDayOff ? 1.25 : 1.3;
    if (updateCheckFood.checked) price += 1000 * (numberOfVisitors || 1);

    return Math.round(price);
};

function updatePrice() {
    document.getElementById('update-total-modal-price').innerText = getUpdatedPrice();
}
