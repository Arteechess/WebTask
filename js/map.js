'use strict'

const address = document.getElementById("address-select");
const addressButton = document.getElementById("address-select-button");
// const API_KEY = "8cd2d1e3-9f22-4415-a47b-7fbe98906090";

let isReady = false;

let latitude = 0;
let longitude = 0;

let targetLatitude = 0;
let targetLongitude = 0;
let targetName = '';

let map = null;
let directions = null;

// window.onload = () => {
//     console.log(22)
//     getGeolocation();
// }

const getGeolocation = () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            createMap();
        }, function (error) {
            console.log(error)
        });
    } else {
        console.log("Not Available");
    }
}

function createMap() {
    map = new mapgl.Map('map', {
        key: API_KEY,
        center: [longitude, latitude],
        zoom: 5,
    });

    directions = new mapgl.Directions(map, {
        directionsApiKey: 'Your directions API access key',
    });

    console.log(directions, map)

    const marker = new mapgl.Marker(map, {
        coordinates: [longitude, latitude],
        label: {
            text: "Вы здесь",
            offset: [0, -75],
            image: {
                url: 'https://docs.2gis.com/img/mapgl/tooltip.svg',
                size: [100, 40],
                padding: [10, 10, 20, 10],
            },
        },
    });

    isReady = true;
}

addressButton.addEventListener('click', () => {
    if (!isReady) {
        alert('Карта ещё не загрузилась');
        return;
    }

    fetchAddressCoords(address.value);
});

const fetchAddressCoords = (address) => {
    const url = `https://catalog.api.2gis.com/3.0/items/geocode?q=${address}&fields=items.point&key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            targetLatitude = data.result.items[0].point.lat;
            targetLongitude = data.result.items[0].point.lon;
            targetName = data.result.items[0].name;

            createTargetMarker();

            console.log(targetLatitude, targetLongitude, targetName);

        })
        .catch(error => {
            console.error('Ошибка:', error);
            return [0, 0];
        });
}

function createTargetMarker() {
    const addressMarker = new mapgl.Marker(map, {
        coordinates: [targetLongitude, targetLatitude],
        label: {
            text: targetName,
            offset: [0, -75],
            image: {
                url: 'https://docs.2gis.com/img/mapgl/tooltip.svg',
                size: [100, 40],
                padding: [10, 10, 20, 10],
            },
        },
    });

    createRoute();
}

function createRoute() {

    fetchRoute([longitude, latitude], [targetLongitude, targetLatitude]);
}

const fetchRoute = (start, finish) => {
    const url = `https://routing.api.2gis.com/carrouting/6.0.0/global?key=${API_KEY}`;

    console.log(start[0], start[1], finish[0], finish[1])
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            points: [
                {
                    "type": "walking",
                    "x": 37.62177,
                    "y": 55.753239
                },
                {
                    "type": "walking",
                    "x": finish[0],
                    "y": finish[1]
                },
            ],
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            directions.carRoute({
                points: [
                    [37.62177, 55.753239],
                    [finish[0], finish[1]],
                ]
            });

        })
        .catch(error => {
            console.error('Ошибка:', error);
            return [];
        });
}
