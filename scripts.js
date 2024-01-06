// get routs data
async function getRoutsData() {
    const apiKey = '3c7a9230-b3c9-4927-99d1-c9180f2d30c8';
    const apiUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes';
    const urlWithApiKey = `${apiUrl}?api_key=${apiKey}`;
    let response = await fetch(urlWithApiKey);
    let content = await response.json();
    return content;
}

function truncateStrings(data, maxLength, keys) {
    data.forEach(obj => {
        keys.forEach(key => {
        if (obj[key].length > maxLength) {
            obj[key] = obj[key].substring(0, obj[key].lastIndexOf(' ', maxLength)) + '...';
        }
        });
    });
    return data;
}

let routsData;
async function paginationMain() {
    let currentPage = 1;
    let rows = 5;
    routsData = await getRoutsData();
    const trimingOrder = ['description', 'mainObject'];
    trimedData = truncateStrings(routsData, 250, trimingOrder)
    function displayList(arrData, rowsPerPage, page) {
        const tableEl = document.getElementById('tableRouts');
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
        const filteredData = dataArr.filter(items => items.mainObject.includes(" - ") || items.mainObject.includes(" – ") || items.mainObject.includes("- "));
        filteredData.forEach(item => {
            const splitedValues = item["mainObject"].split(" - ");
            const secondSplitedValues = [].concat(...splitedValues.map(str => str.split(" – ")));
            const thirdSplitedValues = [].concat(...secondSplitedValues.map(str => str.split("- ")));
            thirdSplitedValues.forEach(value => {
                if (!uniqueValues.includes(value)) {
                    uniqueValues.push(value)
                    const selectEl = document.getElementById("routsSelect");
                    const newSelectOptionEl = document.createElement('option');
                    newSelectOptionEl.textContent = value;
                    newSelectOptionEl.value = value;
                    selectEl.appendChild(newSelectOptionEl);
                }
            })
        })
    }

    document.getElementById("routsSearch").addEventListener("keyup", function(e){
        let selectEl = document.getElementById("routsSelect");
        selectEl.innerHTML = '';
        const SelectOptionChoiceEl = document.createElement('option');
        SelectOptionChoiceEl.textContent = 'Выбрать';
        SelectOptionChoiceEl.selected = true;
        selectEl.appendChild(SelectOptionChoiceEl);
        let searchText = e.target.value.toLowerCase();
        const filteredData = trimedData.filter(item =>
            item.name.toLowerCase().includes(searchText)
        );
        displayList(filteredData, rows, currentPage);
        displayPagination(filteredData, rows);
    })

    document.getElementById("routsSelect").addEventListener("change", function() {
        const selectedValue = this.value;
        document.getElementById("routsSearch").value = "";
        if (selectedValue !== "Выбрать") {
            const filteredData = trimedData.filter(item =>
                item.mainObject.toLowerCase().includes(selectedValue.toLowerCase())
            );
            displayList(filteredData, rows, currentPage);
            displayPagination(filteredData, rows);
        }
        else {
            displayList(trimedData, rows, currentPage); 
            displayPagination(trimedData, rows);
        }
    })

    displayList(trimedData, rows, currentPage);
    displayPagination(trimedData, rows);
    displaySelect(trimedData);
}

paginationMain()