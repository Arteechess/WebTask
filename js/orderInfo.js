async function infoOrder(id, routeId, currRouteName) {
  try {
    const orderUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/${id}?api_key=${API_KEY}`;
    const orderResponse = await fetch(orderUrl);
    const orderData = await orderResponse.json();

    const guideUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/guides/${orderData.guide_id}?api_key=${API_KEY}`;
    const guideResponse = await fetch(guideUrl);
    const guideData = await guideResponse.json();

    displayOrder(orderData, guideData, routeId, currRouteName);
  } catch (error) {
    console.error(error);
  }
}

function displayOrder(data, guideData, routeId, currRouteName) {
  console.log(data);
  const {
    id,
    date,
    time,
    duration,
    persons,
    optionFirst,
    optionSecond,
    price
  } = data;

  document.getElementById('info-order-id').innerText = id;
  document.getElementById('info-guide-name').innerText = guideData.name;
  document.getElementById('info-route-name').innerText = currRouteName;
  document.getElementById('info-date').innerText = date;
  document.getElementById('info-time').innerText = time;
  document.getElementById('info-duration').innerText = duration;
  document.getElementById('info-people').innerText = persons;
  document.getElementById('info-food').innerText = optionFirst ? 'Включено' : 'Не включено';
  document.getElementById('info-guide').innerText = optionSecond ? 'Включено' : 'Не включено';
  document.getElementById('info-price').innerText = price;
}
