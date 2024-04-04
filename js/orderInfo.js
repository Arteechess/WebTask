function infoOrder (id, routeId, currRouteName) {
  const url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/' + id + '?api_key=' + API_KEY

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const guideUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/guides/' + data.guide_id + '?api_key=' + API_KEY
      fetch(guideUrl)
        .then(response => response.json())
        .then(guideData => {
          displayOrder(data, guideData, routeId, currRouteName)
        })
    })
}

function displayOrder (data, guideData, routeId, currRouteName) {
  console.log(data)
  document.getElementById('info-order-id').innerText = data.id
  document.getElementById('info-guide-name').innerText = guideData.name
  document.getElementById('info-route-name').innerText = currRouteName
  document.getElementById('info-date').innerText = data.date
  document.getElementById('info-time').innerText = data.time
  document.getElementById('info-duration').innerText = data.duration
  document.getElementById('info-people').innerText = data.persons

  if (data.optionFirst) {
    document.getElementById('info-food').innerText = 'Включено'
  } else {
    document.getElementById('info-food').innerText = 'Не включено'
  }

  if (data.optionSecond) {
    document.getElementById('info-guide').innerText = 'Включено'
  } else {
    document.getElementById('info-guide').innerText = 'Не включено'
  }
  document.getElementById('info-price').innerText = data.price
}
