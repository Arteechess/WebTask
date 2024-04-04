const guideModalName = document.getElementById('guide-name');
const routeModalName = document.getElementById('route-modal-name');
const tripDate = document.getElementById('trip-date');
const tripTime = document.getElementById('trip-time');
const tripDuration = document.getElementById('trip-duration');
const tripPeopleCount = document.getElementById('trip-people-count');
const checkboxFood = document.getElementById('check-food');
const checkboxTrip = document.getElementById('check-trip');

let isThisDayOff = false;
let isItMorning = false;
let isItEvening = false;
let numberOfVisitors = 0;
let hoursNumber = 0;
let guideOrderPrice = 0;

checkboxFood.addEventListener('change', updatePrice);
checkboxTrip.addEventListener('change', updatePrice);
tripPeopleCount.addEventListener('change', handlePeopleCountChange);
tripDate.addEventListener('change', handleDateChange);
tripTime.addEventListener('change', handleTimeChange);
tripDuration.addEventListener('change', handleDurationChange);

function handlePeopleCountChange() {
    if (tripPeopleCount.value < 1) {
        alert('Количество людей должно быть больше 0');
        tripPeopleCount.value = 1;
    }
    if (tripPeopleCount.value > 20) {
        alert('Количество людей должно не превышать 20');
        tripPeopleCount.value = 20;
    }

    numberOfVisitors = Number(tripPeopleCount.value);
    updatePrice();
}

function handleDateChange() {
    const date = new Date(tripDate.value);
    const isWeekend = date.getDay() === 6 || date.getDay() === 0;
    if (isThisDayOff !== isWeekend) {
        isThisDayOff = isWeekend;

        updatePrice();
    }
}

function handleTimeChange() {
    const time = tripTime.value;

    isItMorning = time >= '09:00' && time <= '12:00';
    isItEvening = time >= '20:00' && time <= '23:00';

    updatePrice();
}

function handleDurationChange() {
    hoursNumber = Number(tripDuration.value);

    updatePrice();
}

function orderRegistration() {
    const url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=' + API_KEY;

    const formData = new FormData();
    formData.append('date', tripDate.value);
    formData.append('duration', tripDuration.value);
    formData.append('guide_id', currentGuide);
    formData.append('optionFirst', Number(checkboxFood.checked));
    formData.append('optionSecond', Number(checkboxTrip.checked));
    formData.append('persons', tripPeopleCount.value);
    formData.append('price', Math.round(getPrice()));
    formData.append('route_id', currentRoute);
    formData.append('time', tripTime.value);

    formData.forEach((value, key) => {
        console.log(key + ' ' + value);
    });

    const requestOptions = {
        method: 'POST',
        body: formData,
        redirect: 'follow'
    };

    fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Произошла ошибка' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            document.getElementById('close-modal').click();
        })
        .catch(error => {
            console.log(error);
        });
}

function getPrice() {
    let price = guideOrderPrice * hoursNumber;

    if (isThisDayOff) price *= 1.5;
    if (isItMorning) price += 400;
    if (isItEvening) price += 1000;
    if (numberOfVisitors >= 5 && numberOfVisitors < 10) price += 1000;
    if (numberOfVisitors >= 10) price += 1500;
    if (checkboxTrip.checked) price *= isThisDayOff ? 1.25 : 1.3;
    if (checkboxFood.checked) price += 1000 * (numberOfVisitors || 1);

    return Math.round(price);
}

function updatePrice() {
    document.getElementById('total-modal-price').innerText = getPrice();
}
