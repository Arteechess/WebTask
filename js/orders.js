'use strict'

const ordersTable = document.getElementById('table-orders')
const ordersArticle = document.getElementById('orders')

const itemsPerPage = 5
let currentPage = 1
let i = 1

let currentOrderId = null

const API_KEY = '8cd2d1e3-9f22-4415-a47b-7fbe98906090'

function fetchOrders () {
  fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      data.sort((a, b) => b.id - a.id)
      displayOrders(data)

      const totalPages = Math.ceil(data.length / itemsPerPage)
      const paginationContainer = document.createElement('nav')
      paginationContainer.setAttribute('aria-label', '...')

      const paginationList = document.createElement('ul')
      paginationList.classList.add('pagination')

      const previousButton = document.createElement('li')
      previousButton.classList.add('page-item')
      const previousLink = document.createElement('a')
      previousLink.classList.add('page-link')
      previousLink.href = '#routes'
      previousLink.innerText = 'Назад'
      previousButton.appendChild(previousLink)
      paginationList.appendChild(previousButton)

      previousLink.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--
          displayOrders(data)

          const allPageItems = paginationList.querySelectorAll('.page-item')
          allPageItems.forEach(item => item.classList.remove('active'))

          const currentPageItem = paginationList.querySelector(`li:nth-child(${currentPage + 1})`)
          currentPageItem.classList.add('active')
        }
      })

      for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li')
        pageItem.classList.add('page-item')

        const pageLink = document.createElement('a')
        pageLink.classList.add('page-link')
        pageLink.href = '#routes'
        pageLink.innerText = i

        if (i === currentPage) {
          pageItem.classList.add('active')
        }

        pageLink.addEventListener('click', () => {
          currentPage = i
          displayOrders(data)

          const allPageItems = paginationList.querySelectorAll('.page-item')
          allPageItems.forEach(item => item.classList.remove('active'))
          pageItem.classList.add('active')
        })

        pageItem.appendChild(pageLink)
        paginationList.appendChild(pageItem)
      }

      const nextButton = document.createElement('li')
      nextButton.classList.add('page-item')
      const nextLink = document.createElement('a')
      nextLink.classList.add('page-link')
      nextLink.href = '#routes'
      nextLink.innerText = 'Вперед'
      nextButton.appendChild(nextLink)
      paginationList.appendChild(nextButton)

      nextLink.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++
          displayOrders(data)

          const allPageItems = paginationList.querySelectorAll('.page-item')
          allPageItems.forEach(item => item.classList.remove('active'))

          const currentPageItem = paginationList.querySelector(`li:nth-child(${currentPage + 1})`)
          currentPageItem.classList.add('active')
        }
      })

      paginationContainer.appendChild(paginationList)
      ordersArticle.appendChild(paginationContainer)
    })
    .catch(e => console.log(e))
}

function displayOrders (data) {
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = data.slice(startIndex, endIndex)

  i = startIndex + 1

  if (paginatedData.length === 0) {
    ordersTable.innerHTML = `
    <tr class="table-primary">
      <td class="fw-bold">№</td>
      <td class="fw-bold">Название маршрута</td>
      <td class="fw-bold">Дата</td>
      <td class="fw-bold">Стоимость</td>
      <td class="fw-bold"></td>
    </tr>
    `
    ordersTable.innerHTML += `
      <tr>
        <td colspan="5" class="text-center"><h4 class="mb-0">Нет заказов</h4></td>
      </tr>
    `
    return
  }

  ordersTable.innerHTML = `
    <tr class="table-primary">
      <td class="fw-bold">№</td>
      <td class="fw-bold">Название маршрута</td>
      <td class="fw-bold">Дата</td>
      <td class="fw-bold">Стоимость</td>
      <td class="fw-bold"></td>
    </tr>
    `

  const routeIds = new Set()
  data.forEach(item => {
    routeIds.add(item.route_id)
  })

  const routeNames = {}
  const requests = Array.from(routeIds).map(id =>
    fetch('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/' + id + '?api_key=' + API_KEY)
      .then(response => response.json())
      .then(data => {
        routeNames[id] = data.name
      })
      .catch(e => console.log(e))
  )

  Promise.all(requests)
    .then(() => {
      paginatedData.forEach(item => {
        ordersTable.innerHTML += `
          <tr>
            <td>${item.id}</td>
            <td>${routeNames[item.route_id]}</td>
            <td>${item.date}</td>
            <td>${item.price}</td>
            <td>
            <button class="border-0 bg-transparent align-self-center" data-bs-toggle="modal" data-bs-target="#info-order-modal" onclick="infoOrder(${item.id}, ${item.route_id}, '${routeNames[item.route_id]}')">
                <img src="../../img/icons/show.png" alt="Информация" class="img-order">
            </button>
            <button class="border-0 bg-transparent align-self-center" data-bs-toggle="modal" data-bs-target="#update-order-modal" onclick="updateOrder(${item.id}, ${item.route_id}, '${routeNames[item.route_id]}')">
                <img src="../../img/icons/pen.png" alt="Редактировать" class="img-order">
            </button>
            <button class="border-0 bg-transparent align-self-center" data-bs-toggle="modal" data-bs-target="#delete-order-modal" onclick="currentOrderId = ${item.id};">
                <img src="../../img/icons/bin.png" alt="Удалить" class="img-order">
            </button>
            </td>
          </tr>
        `
        i++
      })
    })
}

window.onload = function () {
  fetchOrders()
}
