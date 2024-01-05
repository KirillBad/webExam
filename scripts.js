// get routs data
async function getRoutsData() {
    const apiKey = '3c7a9230-b3c9-4927-99d1-c9180f2d30c8';
    const apiUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes';
    const urlWithApiKey = `${apiUrl}?api_key=${apiKey}`;
    let response = await fetch(urlWithApiKey);
    let content = await response.json();
    return content;
}

async function paginationMain() {
    let currentPage = 1;
    let rows = 5;
    const dataArray = await getRoutsData();
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
                console.log(prop);
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
            displayList(dataArray, rows, currentPage);
        });
        prevLi.appendChild(prevA);
        paginationEl.appendChild(prevLi);
        for (let i = 0; i < pagesCount; i++) {
            const liEl = displayPaginationBtn(i + 1);
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
            displayList(dataArray, rows, currentPage);
        });
        nextA.appendChild(nextSpan);
        nextLi.appendChild(nextA);
        paginationEl.appendChild(nextLi);
    }
    function displayPaginationBtn(page) {
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
            displayList(dataArray, rows, currentPage);
        });
        return liEl;
    }

    displayList(dataArray, rows, currentPage);
    displayPagination(dataArray, rows);
}

paginationMain()