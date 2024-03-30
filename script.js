'use strict';

const routesTable = document.getElementById('table-routes');
const routesArticle = document.getElementById('routes');
const routeSelect = document.getElementById('route-select');

const itemsPerPage = 5;
let currentPage = 1;
let routesData = [];

const API_KEY = '8cd2d1e3-9f22-4415-a47b-7fbe98906090';

function displayItems(page, data) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  routesTable.innerHTML = `
    <tr class="table-primary text-center">
      <td class="fw-bold">Название</td>
      <td class="fw-bold">Описание</td>
      <td class="fw-bold">Основные объекты</td>
      <td></td>
    </tr>
    `;

  paginatedData.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.description}</td>
      <td>${item.mainObject}</td>
<!--      <td><button class="btn btn-primary align-self-center" onclick="fetchGuides(${item.id}, '${item.name}')">-->
        Выбрать
      </button></td>
    `;
    routesTable.appendChild(row);
  });
}

function selectRoutes() {
  if (routeSelect.value !== '') {
    const filteredData = routesData.filter(item =>
      item.name.toLowerCase().includes(routeSelect.value.toLowerCase())
    );
    currentPage = 1;
    displayItems(currentPage, filteredData);
  }
}

function fetchRoutes() {
  fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      routesData = data;
      displayItems(currentPage, data);
      createPagination(data.length);
    })
    .catch(error => {
      console.error('Ошибка:', error);
    });
}

function createPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationContainer = document.createElement('nav');
  paginationContainer.setAttribute('aria-label', '...');

  const paginationList = document.createElement('ul');
  paginationList.classList.add('pagination', 'row');

  paginationList.appendChild(createPageButton('Назад', () => {
    if (currentPage > 1) {
      currentPage--;
      displayItems(currentPage, routesData);
      updatePaginationUI();
    }
  }));

  for (let i = 1; i <= totalPages; i++) {
    paginationList.appendChild(createPageButton(i, () => {
      currentPage = i;
      displayItems(currentPage, routesData);
      updatePaginationUI();
    }, i === currentPage));
  }

  paginationList.appendChild(createPageButton('Вперед', () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayItems(currentPage, routesData);
      updatePaginationUI();
    }
  }));

  paginationContainer.appendChild(paginationList);
  routesArticle.appendChild(paginationContainer);
}

function createPageButton(label, onClick, isActive = false) {
  const pageItem = document.createElement('li');
  pageItem.classList.add('page-item', 'page-item', 'col-2', 'col-md-auto', 'col-sm-auto', 'm-0', 'p-0', 'text-center');

  const pageLink = document.createElement('a');
  pageLink.classList.add('page-link');
  pageLink.href = '#routes';
  pageLink.innerText = label;

  if (isActive) {
    pageItem.classList.add('active');
  }

  pageLink.addEventListener('click', onClick);

  pageItem.appendChild(pageLink);
  return pageItem;
}

function updatePaginationUI() {
  const paginationList = document.querySelector('.pagination');
  const allPageItems = paginationList.querySelectorAll('.page-item');
  allPageItems.forEach(item => item.classList.remove('active'));

  const currentPageItem = paginationList.querySelector(`li:nth-child(${currentPage + 1})`);
  currentPageItem.classList.add('active');
}

window.onload = function () {
  fetchRoutes();
};
