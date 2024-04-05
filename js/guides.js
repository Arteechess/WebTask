const guides = document.getElementById('table-guides');
const routeName = document.getElementById('route-name');
const routeNotSelected = document.getElementById('route-not-selected');
const minWorkExperience = document.getElementById('experience-range-start');
let minWorkExperienceValue = 0;
const maxWorkExperience = document.getElementById('experience-range-end');
let maxWorkExperienceValue = 0;

let guidesData = [];
let startData = [];
const langSelect = document.getElementById('lang-select');
const langSet = new Set();

let currentRoute = null;
let currentGuide = null;
let currentPrice = null;

function getYearString(year) {
  if (year % 10 === 1 && year !== 11) {
    return 'год';
  }
  if (year % 10 >= 2 && year % 10 <= 4 && (year < 10 || year > 20)) {
    return 'года';
  }
  return 'лет';
}

function setModalData(id, name, language, workExperience, pricePerHour, route) {
  currentGuide = id;
  guideModalName.innerText = name;
  guideOrderPrice = pricePerHour;
  routeModalName.innerText = routeName.innerText;
  currentRoute = Number(route);
  tripDuration.value = workExperience + ' ' + getYearString(workExperience);
  document.getElementById('total-modal-price').innerText = pricePerHour;
  currentPrice = pricePerHour;
  document.getElementById('check-food').checked = false;
  document.getElementById('check-trip').checked = false;
  document.getElementById('trip-date').value = '';
  document.getElementById('trip-time').value = '12:00';
  document.getElementById('trip-people-count').value = 1;
}

function displayGuideItems(data, name, routeId) {
  if (routeNotSelected.innerText !== '') {
    routeNotSelected.innerText = '';
  }
  if (langSelect.innerText !== '') {
    langSelect.innerHTML = `<option value="0">Язык экскурсии</option>`;
  }

  guides.innerHTML = `
    <tr class="table-primary">
      <td class="fw-bold">ФИО</td>
      <td class="fw-bold">Языки</td>
      <td class="fw-bold">Опыт работы</td>
      <td class="fw-bold">Стоимость услуг в час</td>
      <td></td>
    </tr>
    `;

  langSet.clear();
  guidesData = [];

  if (Array.isArray(data) && data.length > 0) {
    routeName.innerText = '"' + name + '"';

    data.forEach(item => {
      guidesData.push(item);

      if (item.workExperience > maxWorkExperienceValue) {
        maxWorkExperienceValue = item.workExperience;
      }
      if (item.workExperience < minWorkExperienceValue) {
        minWorkExperienceValue = item.workExperience;
      }

      lang = item.language;
      langSet.add(lang);
    });

    minWorkExperience.value = minWorkExperienceValue;
    maxWorkExperience.value = maxWorkExperienceValue;
    startData = guidesData;
    setExperienceTable();

    langSet.forEach(item => {
      langSelect.innerHTML += `<option value="${item}">${item}</option>`;
    });
  } else {
    console.error('Ошибка: Некорректные данные');
  }
}

function fetchGuides(id, name) {
  if (routeName.innerText !== '') {
    routeName.innerText = '';
  }

  fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${id}/guides?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      displayGuideItems(data, name, id);
    });
}

langSelect.addEventListener('change', setExperienceTable);
minWorkExperience.addEventListener('change', setExperienceTable);
maxWorkExperience.addEventListener('change', setExperienceTable);

function setExperienceTable() {
  const selectedLang = langSelect.value;

  guides.innerHTML = `
    <tr class="text-center">
      <td class="fw-bold" style="background: #a0d0b1;">ФИО</td>
      <td class="fw-bold" style="background: #a0d0b1;">Языки</td>
      <td class="fw-bold" style="background: #a0d0b1;">Опыт работы</td>
      <td class="fw-bold" style="background: #a0d0b1;">Стоимость услуг в час</td>
      <td style="background: #a0d0b1;"></td>
    </tr>
    `;

  let filteredGuidesExperiences = [];

  console.log(minWorkExperience.value, maxWorkExperience.value, startData);
  for (const startDataKey in startData) {
    if (startData[startDataKey].workExperience >= Number(minWorkExperience.value) && startData[startDataKey].workExperience <= Number(maxWorkExperience.value)) {
      filteredGuidesExperiences.push(startData[startDataKey]);
    }
  }

  console.log(filteredGuidesExperiences);

  if (selectedLang !== '0') {
    filteredGuidesExperiences = filteredGuidesExperiences.filter(item => item.language === selectedLang);
  }

  console.log(filteredGuidesExperiences);

  filteredGuidesExperiences.forEach(item => {
    guides.innerHTML += `
      <tr>
        <td style="background: mintcream;">${item.name}</td>
        <td style="background: mintcream;">${item.language}</td>
        <td style="background: mintcream;">${item.workExperience} ${getYearString(item.workExperience)}</td>
        <td style="background: mintcream;">${item.pricePerHour}/час</td>
        <td style="background: mintcream;"><button class="btn btn-primary align-self-center" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="setModalData(${item.id}, '${item.name}', '${item.language}', ${item.workExperience}, ${item.pricePerHour}, ${item.route_id})">Выбрать</button></td>
      </tr>
    `;
  });
}
