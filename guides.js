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

function getYearString(year) {
  if (year % 10 === 1 && year !== 11) {
    return 'год';
  }
  if (year % 10 >= 2 && year % 10 <= 4 && (year < 10 || year > 20)) {
    return 'года';
  }
  return 'лет';
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
    <tr class="table-primary">
      <td class="fw-bold">ФИО</td>
      <td class="fw-bold">Языки</td>
      <td class="fw-bold">Опыт работы</td>
      <td class="fw-bold">Стоимость услуг в час</td>
      <td></td>
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
        <td>${item.name}</td>
        <td>${item.language}</td>
        <td>${item.workExperience} ${getYearString(item.workExperience)}</td>
        <td>${item.pricePerHour}/час</td>
        <td><button class="btn btn-primary align-self-center">Выбрать</button></td>
      </tr>
    `;
  });
}
