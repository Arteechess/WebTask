'use strict';

const ordersTable = document.getElementById('table-orders');
const ordersArticle = document.getElementById('orders');

const itemsPerPage = 5;
let currentPage = 1;
let i = 1;

let currentOrderId = null;

const API_KEY = 'af55d856-11f2-4f40-8b68-57b23fd2e486';

function fetchOrders() {
    fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => b.id - a.id);
            displayOrders(data);
            addPagination(data);
        })
        .catch(error => console.error(error));
}

function displayOrders(data) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    i = startIndex + 1;

    if (paginatedData.length === 0) {
        displayNoOrdersMessage();
        return;
    }

    renderOrdersTableHeader();

    const routeIds = new Set();
    data.forEach(item => {
        routeIds.add(item.route_id);
    });

    const routeNames = {};
    const requests = Array.from(routeIds).map(id =>
        fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${id}?api_key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                routeNames[id] = data.name;
            })
            .catch(error => console.error(error))
    );

    Promise.all(requests)
        .then(() => {
            paginatedData.forEach(item => {
                renderOrderRow(item, routeNames[item.route_id]);
                i++;
            });
        });
}

function renderOrdersTableHeader() {
    ordersTable.innerHTML = `
    <tr class="table-primary">
      <td class="fw-bold">№</td>
      <td class="fw-bold">Название маршрута</td>
      <td class="fw-bold">Дата</td>
      <td class="fw-bold">Стоимость</td>
      <td class="fw-bold"></td>
    </tr>
  `;
}

function renderOrderRow(item, routeName) {
    ordersTable.innerHTML += `
    <tr>
      <td>${item.id}</td>
      <td>${routeName}</td>
      <td>${item.date}</td>
      <td>${item.price}</td>
      <td>
        <button class="border-0 bg-transparent align-self-center" data-bs-toggle="modal" data-bs-target="#info-order-modal" onclick="infoOrder(${item.id}, ${item.route_id}, '${routeName}')">
          <img src="../../img/icons/show.png" alt="Информация" class="img-order">
        </button>
        <button class="border-0 bg-transparent align-self-center" data-bs-toggle="modal" data-bs-target="#update-order-modal" onclick="updateOrder(${item.id}, ${item.route_id}, '${routeName}')">
          <img src="../../img/icons/pen.png" alt="Редактировать" class="img-order">
        </button>
        <button class="border-0 bg-transparent align-self-center" data-bs-toggle="modal" data-bs-target="#delete-order-modal" onclick="currentOrderId = ${item.id};">
          <img src="../../img/icons/bin.png" alt="Удалить" class="img-order">
        </button>
      </td>
    </tr>
  `;
}

function addPagination(data) {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginationContainer = document.createElement('nav');
    paginationContainer.setAttribute('aria-label', '...');

    const paginationList = document.createElement('ul');
    paginationList.classList.add('pagination');

    addPreviousButton(paginationList);
    addPageButtons(paginationList, totalPages);
    addNextButton(paginationList, totalPages);

    paginationContainer.appendChild(paginationList);
    ordersArticle.appendChild(paginationContainer);
}

function addPreviousButton(paginationList) {
    const previousButton = createPaginationButton('Назад');
    previousButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchOrders();
        }
    });
    paginationList.appendChild(previousButton);
}

function addPageButtons(paginationList, totalPages) {
    for (let page = 1; page <= totalPages; page++) {
        const pageButton = createPaginationButton(page);
        pageButton.addEventListener('click', () => {
            currentPage = page;
            fetchOrders();
        });
        if (page === currentPage) {
            pageButton.classList.add('active');
        }
        paginationList.appendChild(pageButton);
    }
}

function addNextButton(paginationList, totalPages) {
    const nextButton = createPaginationButton('Вперед');
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchOrders();
        }
    });
    paginationList.appendChild(nextButton);
}

function createPaginationButton(text) {
    const pageItem = document.createElement('li');
    pageItem.classList.add('page-item');

    const pageLink = document.createElement('a');
    pageLink.classList.add('page-link');
    pageLink.href = '#routes';
    pageLink.innerText = text;

    pageItem.appendChild(pageLink);
    return pageItem;
}

function displayNoOrdersMessage() {
    ordersTable.innerHTML = `
    <tr class="table-primary">
      <td class="fw-bold">№</td>
      <td class="fw-bold">Название маршрута</td>
      <td class="fw-bold">Дата</td>
      <td class="fw-bold">Стоимость</td>
      <td class="fw-bold"></td>
    </tr>
    <tr>
      <td colspan="5" class="text-center"><h4 class="mb-0">Нет заказов</h4></td>
    </tr>
  `;
}

window.onload = function () {
    fetchOrders();
};
