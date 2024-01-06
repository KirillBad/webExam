// test data
const dataArrayT = [
    { name: 'Элемент 1', description: 'Описание 1', mainObject: 'Основной-объект 1' },
    { name: 'Элемент 2', description: 'Описание 2', mainObject: 'Основной-объект 2' },
    { name: 'Элемент 3', description: 'Описание 3', mainObject: 'Основной-объект 3' },
    { name: 'Элемент 4', description: 'Описание 4', mainObject: 'Основной-объект 4' },
    { name: 'Элемент 5', description: 'Описание 5', mainObject: 'Основной-объект 5' },
    { name: 'Элемент 6', description: 'Описание 6', mainObject: 'Основной-объект 6' },
    { name: 'Элемент 7', description: 'Описание 7', mainObject: 'Основной-объект 7' },
    { name: 'Элемент 8', description: 'Описание 8', mainObject: 'Основной-объект 8' },
    { name: 'Элемент 9', description: 'Описание 9', mainObject: 'Основной-объект 9' },
    { name: 'Элемент 10', description: 'Описание 10', mainObject: 'Основной-объект-10' },
    { name: 'Элемент 11', description: 'Описание 11', mainObject: 'Основной объект 11' },
    { name: 'Элемент 12', description: 'Описание 12', mainObject: 'Основной объект 12' },
    { name: 'Элемент 13', description: 'Описание 13', mainObject: 'Основной объект 13' },
    { name: 'Элемент 14', description: 'Описание 14', mainObject: 'Основной объект 14' },
    { name: 'Элемент 15', description: 'Описание 15', mainObject: 'Основной объект 15' },
    { name: 'Элемент 16', description: 'Описание 16', mainObject: 'Основной объект 16' },
    { name: 'Элемент 17', description: 'Описание 17', mainObject: 'Основной объект 17' },
    { name: 'Элемент 18', description: 'Описание 18', mainObject: 'Основной объект 18' },
    { name: 'Элемент 19', description: 'Описание 19', mainObject: 'Основной объект 19' },
    { name: 'Элемент 20', description: 'Описание 20', mainObject: 'Основной объект 20' },
    { name: 'Элемент 21', description: 'Описание 21', mainObject: 'Основной объект 21' },
    { name: 'Элемент 22', description: 'Описание 22', mainObject: 'Основной объект 22' },
    { name: 'Элемент 23', description: 'Описание 23', mainObject: 'Основной объект 23' },
    { name: 'Элемент 24', description: 'Описание 24', mainObject: 'Основной объект 24' },
    { name: 'Элемент 25', description: 'Описание 25', mainObject: 'Основной объект 25' },
    { name: 'Элемент 26', description: 'Описание 26', mainObject: 'Основной объект 26' },
    { name: 'Элемент 27', description: 'Описание 27', mainObject: 'Основной объект 27' },
    { name: 'Элемент 28', description: 'Описание 28', mainObject: 'Основной объект 28' },
    { name: 'Элемент 29', description: 'Описание 29', mainObject: 'Основной объект 29' },
    { name: 'Элемент 30', description: 'Описание 30', mainObject: 'Основной объект 30' }
  ];

// get routs data
async function getRoutsData() {
    const apiKey = '3c7a9230-b3c9-4927-99d1-c9180f2d30c8';
    const apiUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes';
    const urlWithApiKey = `${apiUrl}?api_key=${apiKey}`;
    let response = await fetch(urlWithApiKey);
    let content = await response.json();
    return content;
}

let routsData;
async function paginationMain() {
    let currentPage = 1;
    let rows = 5;
    routsData = await getRoutsData();
    // arrData = dataArrayT;
    function displayList(arrData, rowsPerPage, page) {
        const tableEl = document.querySelector('#listBody');
        tableEl.innerHTML = '';
        page--;
        const start = rowsPerPage * page;
        const end = start + rowsPerPage;
        const paginatedData = arrData.slice(start, end);
        const propertiesOrder = ['name', 'description', 'mainObject'];
        for (key in paginatedData) {
            const newRow = document.createElement('tr');
            for (prop of propertiesOrder) {
                const th = document.createElement('th');
                th.setAttribute('scope', 'col');
                th.textContent = `${paginatedData[key][prop]}`;
                newRow.appendChild(th);
            }
            const thWithButton = document.createElement('th');
            thWithButton.setAttribute('scope', 'col'); 
            const button = document.createElement('button');
            button.className = 'btn btn-outline-primary';
            button.textContent = 'Выбрать';
            thWithButton.appendChild(button);
            newRow.appendChild(thWithButton);
            tableEl.appendChild(newRow);
        };
    }
    function displayPagination(arrData, rowsPerPage) {
        const paginationEl = document.querySelector('.pagination');
        paginationEl.innerHTML = '';
        const pagesCount = Math.ceil(arrData.length / rowsPerPage);
        const prevLi = document.createElement('li');
        prevLi.classList.add('page-item');
        const prevA = document.createElement('a');
        prevA.classList.add('page-link');
        prevA.href = '#';
        prevA.setAttribute('aria-label', 'Previous');
        const prevSpan = document.createElement('span');
        prevSpan.setAttribute('aria-hidden', 'true');
        prevSpan.textContent = '«';
        prevA.appendChild(prevSpan);
        prevA.addEventListener('click', () => {
            event.preventDefault();
            if (currentPage - 1 > 0){
                currentPage -= 1;
                const paginationItems = document.querySelectorAll('.pagination .page-item');
                paginationItems.forEach(item => item.classList.remove('active'));
                const prevPaginationItem = document.querySelector(`.pagination .page-item:nth-child(${currentPage + 1})`);
                prevPaginationItem.classList.add('active');
            }
            displayList(arrData, rows, currentPage);
        });
        prevLi.appendChild(prevA);
        paginationEl.appendChild(prevLi);
        for (let i = 0; i < pagesCount; i++) {
            const liEl = displayPaginationBtn(i + 1, arrData);
            paginationEl.appendChild(liEl);
        }
        const nextLi = document.createElement('li');
        nextLi.classList.add('page-item');
        const nextA = document.createElement('a');
        nextA.classList.add('page-link');
        nextA.href = '#';
        nextA.setAttribute('aria-label', 'Next');
        const nextSpan = document.createElement('span');
        nextSpan.setAttribute('aria-hidden', 'true');
        nextSpan.textContent = '»';
        nextA.addEventListener('click', () => {
            event.preventDefault();
            if (currentPage + 1 <= pagesCount){
                currentPage += 1;
                const paginationItems = document.querySelectorAll('.pagination .page-item');
                paginationItems.forEach(item => item.classList.remove('active'));
                const nextPaginationItem = document.querySelector(`.pagination .page-item:nth-child(${currentPage + 1})`);
                nextPaginationItem.classList.add('active');
            }
            displayList(arrData, rows, currentPage);
        });
        nextA.appendChild(nextSpan);
        nextLi.appendChild(nextA);
        paginationEl.appendChild(nextLi);
    }
    function displayPaginationBtn(page, data) {
        const liEl = document.createElement('li');
        liEl.classList.add('page-item');
        const aEl = document.createElement('a');
        aEl.classList.add('page-link');
        aEl.textContent = page;
        aEl.href = '#';
        liEl.appendChild(aEl);
        liEl.addEventListener('click', () => {
            event.preventDefault();
            const paginationItems = document.querySelectorAll('.pagination .page-item');
            paginationItems.forEach(item => item.classList.remove('active'));
            currentPage = page;
            liEl.classList.add('active');
            displayList(data, rows, currentPage);
        });
        return liEl;
    }

    function displaySelect(dataArr) {
        let uniqueValues = [];
        dataArr.forEach(item => {
            const splitedValues = item["mainObject"].split(" - ");
            splitedValues.forEach(value => {
                const trimmedValue = value.trim();
                if (!uniqueValues.includes(trimmedValue)) {
                    uniqueValues.push(trimmedValue)
                    const selectEl = document.getElementById("routsSelect");
                    const newSelectOptionEl = document.createElement('option');
                    newSelectOptionEl.textContent = trimmedValue;
                    newSelectOptionEl.trimmedValue = trimmedValue;
                    selectEl.appendChild(newSelectOptionEl);
                }
            })
        })
    }

    document.getElementById("routsSearch").addEventListener("keyup", function(e){
        let searchText = e.target.value.toLowerCase();
        const filteredData = routsData.filter(item =>
            item.name.toLowerCase().includes(searchText)
        );
        displayList(filteredData, rows, currentPage);
        displayPagination(filteredData, rows);
    })

    document.getElementById("routsSelect").addEventListener("change", function() {
        const selectedValue = this.value;
        if (selectedValue !== "Выбрать") {
            const filteredData = routsData.filter(item =>
                item.mainObject.toLowerCase().includes(selectedValue.toLowerCase())
            );
            displayList(filteredData, rows, currentPage);
            displayPagination(filteredData, rows);
        }
        else {
            displayList(routsData, rows, currentPage);
            displayPagination(routsData, rows);
        }
    })

    displayList(routsData, rows, currentPage);
    displayPagination(routsData, rows);
    displaySelect(routsData);
}

paginationMain()