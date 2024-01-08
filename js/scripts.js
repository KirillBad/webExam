async function getRoutsData() {
    const apiKey = '3c7a9230-b3c9-4927-99d1-c9180f2d30c8';
    const apiUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes';
    const urlWithApiKey = `${apiUrl}?api_key=${apiKey}`;
    let response = await fetch(urlWithApiKey);
    let content = await response.json();
    return content;
}

async function getRoutGuidesData(routId) {
    const apiKey = '3c7a9230-b3c9-4927-99d1-c9180f2d30c8';
    const apiUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${routId}/guides`;
    const urlWithApiKey = `${apiUrl}?api_key=${apiKey}`;
    let response = await fetch(urlWithApiKey);
    let content = await response.json();
    return content;
}

async function sendOrderData(data) {
    const apiKey = '3c7a9230-b3c9-4927-99d1-c9180f2d30c8';
    const apiUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders`;
    const urlWithApiKey = `${apiUrl}?api_key=${apiKey}`;
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data).toString()
    };
    let response = await fetch(urlWithApiKey, requestOptions);
    let content = await response.json();
    console.log(content);
    return content;
}

async function getOrderData() {
    const apiKey = '3c7a9230-b3c9-4927-99d1-c9180f2d30c8';
    const apiUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders`;
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

async function paginationMain() {
    let selectedRoutId = null;
    let currentPage = 1;
    let rows = 5;
    const routsData = await getRoutsData();
    const trimingOrder = ['description', 'mainObject'];
    const trimedData = truncateStrings(routsData, 250, trimingOrder)
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
            button.dataset.id = paginatedData[key]["id"];
            button.dataset.routName = paginatedData[key]["name"];

            if (paginatedData[key]["id"] == selectedRoutId) {
                newRow.classList.add("selected");
            }
            else {
                newRow.classList.remove("selected");
            }

            button.addEventListener("click", async () => {
                await mainTourGuidesData(button.dataset.id, button.dataset.routName);
                document.getElementById("tourGuide").classList.remove('d-none');
                document.getElementById("footer").classList.remove('bg-light');
                document.getElementById("routNameForGuidDisplay").textContent = button.dataset.routName;
            });

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

        const buttons = document.querySelectorAll('.pagination .page-link');
        buttons.forEach(button => {
            if (button.textContent.trim() === '1') {
                button.parentElement.classList.add('active');
            }
        });
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
        const optionToSelect = Array.from(selectEl.options).find(option => option.textContent === "Выбрать");
        optionToSelect.selected = true;
        let searchText = e.target.value.toLowerCase();
        const filteredData = trimedData.filter(item =>
            item.name.toLowerCase().includes(searchText)
        );
        displayList(filteredData, rows, 1);
        displayPagination(filteredData, rows);
        const buttons = document.querySelectorAll('.pagination .page-link');
        buttons.forEach(button => {
            if (button.textContent.trim() === '1') {
                button.parentElement.classList.add('active');
            }
        });
    })

    document.getElementById("routsSelect").addEventListener("change", function() {
        const selectedValue = this.value;
        document.getElementById("routsSearch").value = "";
        if (selectedValue !== "Выбрать") {
            const filteredData = trimedData.filter(item =>
                item.mainObject.toLowerCase().includes(selectedValue.toLowerCase())
            );
            displayList(filteredData, rows, 1);
            displayPagination(filteredData, rows);
        }
        else {
            displayList(trimedData, rows, 1); 
            displayPagination(trimedData, rows);
        }
    })

    displayList(trimedData, rows, currentPage);
    displayPagination(trimedData, rows);
    displaySelect(trimedData);

    let selectedTourGuideId = null;
    async function mainTourGuidesData(id, routName){
        selectedRoutId = id;
                
        displayList(trimedData, rows, currentPage);
        const tourGuidesData = await getRoutGuidesData(id);
        const workExperienceValues = tourGuidesData.map(guide => guide["workExperience"]);
        const maxWorkExperience = Math.max(...workExperienceValues);
        const minWorkExperience = Math.min(...workExperienceValues);
        const slider = document.getElementById("customRange2");
        document.getElementById("minSliderValue").textContent = minWorkExperience;
        document.getElementById("maxSliderValue").textContent = maxWorkExperience;
        slider.min = minWorkExperience;
        slider.max = maxWorkExperience;
        slider.value = minWorkExperience;
        const selectLangugageEl = document.getElementById("guidesSelect");
    
        displayTourGuidesData(tourGuidesData);
        displaySelectLanguage(tourGuidesData);

        function displayTourGuidesData(data) {
            const tableEl = document.getElementById('tableTourGuides');
            tableEl.innerHTML = ''; 
            const propertiesOrder = ['name', 'language', 'workExperience', 'pricePerHour'];
            for (key in data) {
                const newRow = document.createElement('tr');
                const thWithImg = document.createElement("th");
                thWithImg.setAttribute('scope', 'col'); 
                const img = document.createElement("img");
                img.src = "/img/guideImg.png";
                img.width = "70";
                img.height = "70";
                thWithImg.appendChild(img);
                newRow.appendChild(thWithImg);
                for (prop of propertiesOrder) {
                    const th = document.createElement('th');
                    th.setAttribute('scope', 'col');
                    th.textContent = `${data[key][prop]}`;
                    newRow.appendChild(th);
                }
                const thWithButton = document.createElement('th');
                thWithButton.setAttribute('scope', 'col'); 
                const button = document.createElement('button');
                button.className = 'btn btn-outline-primary';
                button.type = 'button';
                button.setAttribute('data-bs-toggle', 'modal');
                button.setAttribute('data-bs-target', '#exampleModal');
                button.textContent = 'Выбрать';
    
                button.dataset.guideName = data[key]["name"];
                button.dataset.guidepricePerHour = data[key]["pricePerHour"];
                button.dataset.tourGuidId = data[key]["id"];
    
                button.addEventListener("click", async () => {
                    document.getElementById("displayGuideName").textContent = "Гид: " + button.dataset.guideName;
                    document.getElementById("displayRoutName").textContent = "Маршрут: " + routName;
                    updateCostModal(button.dataset.guidepricePerHour);
                    const allRows = tableEl.getElementsByTagName('tr');
                    for (const row of allRows) {
                        row.classList.remove('selected');
                    }
                    newRow.classList.add("selected")
                    selectedTourGuideId = button.dataset.tourGuidId;
                });

                if (data[key]["id"] == selectedTourGuideId) {
                    newRow.classList.add("selected")
                }

                thWithButton.appendChild(button);
                newRow.appendChild(thWithButton);
                tableEl.appendChild(newRow);
            };
        }
    
        function displaySelectLanguage(dataArr) {
            let uniqueValues = [];
            const selectEl = document.getElementById("guidesSelect");
            selectEl.innerHTML = "";
            const firstSelectOptionEl = document.createElement('option');
            firstSelectOptionEl.textContent = 'Выбрать язык экскурсии';
            selectEl.appendChild(firstSelectOptionEl);
    
            dataArr.forEach(item => {
                if (!uniqueValues.includes(item['language'])) {
                    uniqueValues.push(item['language'])
                    const newSelectOptionEl = document.createElement('option');
                    newSelectOptionEl.textContent = item['language'];
                    newSelectOptionEl.value = item['language'];
                    selectEl.appendChild(newSelectOptionEl);
                }
            })
        }
    
        let selectedValue;
    
        function sliderSort(SliderValue, data){
            return filteredDataSlider = data.filter(item => item.workExperience >= SliderValue && item.workExperience <= slider.max);
        }
    
        slider.addEventListener('input', () => {
            if (selectLangugageEl.value == "Выбрать язык экскурсии") {
                displayTourGuidesData(sliderSort(slider.value, tourGuidesData));
            }
            else {
                displayTourGuidesData(sliderSort(slider.value, selectSort(selectedValue, tourGuidesData)));
            }
        });    
    
        function selectSort(SelectValue, data) {
            return filteredDataSelect = data.filter(item => item.language.toLowerCase().includes(SelectValue.toLowerCase()));
        }
    
        selectLangugageEl.addEventListener("change", function() {
            selectedValue = this.value;
            if (slider.value == minWorkExperience) {
                if (selectedValue !== "Выбрать язык экскурсии") {
                    displayTourGuidesData(selectSort(selectedValue, tourGuidesData));
                }
                else {
                    displayTourGuidesData(tourGuidesData);
                }
            }
            else {
                if (selectedValue !== "Выбрать язык экскурсии") {
                    displayTourGuidesData(sliderSort(slider.value, selectSort(selectedValue, tourGuidesData)));
                }
                else {
                    displayTourGuidesData(sliderSort(slider.value, tourGuidesData));
                }
            }
        })
    }

    function updateCostModal(priceHour) {
        const publicHolidaysList = [
            "2024-02-23",
            "2024-03-08",
            "2024-04-29",
            "2024-04-30",
            "2024-05-01",
            "2024-05-09",
            "2024-05-10",
            "2024-06-12",
            "2024-11-04",
            "2024-12-30",
            "2024-12-31",
        ];
    
        const guidePricePerHour = priceHour !== undefined ? priceHour : updateCostModal.guidePricePerHour;
        let inputDate = document.getElementById('routDate');
        let inputTime = document.getElementById('routTime');
        let inputSelect = document.getElementById('selectHours');
        let inputPeopleCount = document.getElementById('peopleCount');
        let inputTourGuideCheckBox = document.getElementById('tourGuideCheckBox');
        let inputCarCheckBox = document.getElementById('carCheckBox');
        let dayMultiplier = 1;
    
        let date = new Date(inputDate.value);
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            dayMultiplier = 1.5;
        }
        const formattedDate = date.toISOString().split('T')[0];
        if (publicHolidaysList.includes(formattedDate)) {
            dayMultiplier = 1.5;
        }
    
        const currentTime = new Date(`2000-01-01T${inputTime.value}`);
        const hour = currentTime.getHours();
        const earlyTimeCost = (hour >= 9 && hour <= 12) ? 400 : 0;
        const lateTimeCost = (hour >= 20 && hour <= 23) ? 1000 : 0;
    
        const peopleCountCost = 
        inputPeopleCount.value >= 1 && inputPeopleCount.value <= 5 ? 0 :
        inputPeopleCount.value > 5 && inputPeopleCount.value <= 10 ? 1000 :
        inputPeopleCount.value > 10 && inputPeopleCount.value <= 20 ? 1500 : 0;
     
        let totalPrice = guidePricePerHour * inputSelect.value.split(' ')[0] * dayMultiplier + earlyTimeCost + lateTimeCost + peopleCountCost;
    
        if (inputTourGuideCheckBox.checked) {
            totalPrice *= 1.3;
        }
    
        if (inputCarCheckBox.checked) {
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                totalPrice *= 1.25;
            }
            else {
                totalPrice *= 1.3;
            } 
        }
    
        totalPriceNoString = Math.ceil(totalPrice);
        totalPrice = Math.ceil(totalPrice) + "р";
    
        document.getElementById("totalPriceDisplay").textContent = totalPrice;
    
        updateCostModal.guidePricePerHour = guidePricePerHour;

        document.getElementById("btnSendOrder").addEventListener("click", async () => {
            const sendingOrderData = {
                guide_id: selectedTourGuideId,
                route_id : selectedRoutId,
                date : inputDate.value,
                time: inputTime.value,
                duration : inputSelect.value.split(' ')[0],
                persons : inputPeopleCount.value,
                price : totalPriceNoString,
                optionFirst : inputTourGuideCheckBox.checked ? 1 : 0,
                optionSecond : inputCarCheckBox.checked ? 1 : 0
            };
            await sendOrderData(sendingOrderData);
        });
    };
    
    document.getElementById('orderingModal').addEventListener('input', () => {
        updateCostModal()
    });
    
    document.getElementById('orderingModal').addEventListener('change', () => {
        updateCostModal();
    });
}

async function mainAccount () {
    let currentPage = 1;
    let rows = 5;
    const orderData = await getOrderData();
    const routsData = await getRoutsData();
    const guideData = await getRoutGuidesData();

    // const orderData = testOrderData;
    // const routsData = testRoutsData;
    // const guideData = testGuideData;

    let inputDate = document.getElementById('routDate');
    let inputTime = document.getElementById('routTime');
    let inputSelect = document.getElementById('selectHours');
    let inputPeopleCount = document.getElementById('peopleCount');
    let inputTourGuideCheckBox = document.getElementById('tourGuideCheckBox');
    let inputCarCheckBox = document.getElementById('carCheckBox');

    function displayList(arrData, routsArrData, guideDataArr, rowsPerPage, page) {
        const tableEl = document.getElementById('tableOrders');
        tableEl.innerHTML = ''; 
        page--;
        const start = rowsPerPage * page;
        const end = start + rowsPerPage;
        const paginatedData = arrData.slice(start, end);
        const propertiesOrder = ['route_id', 'date', 'price'];

        for (key in paginatedData) {
            for (routKey in routsArrData) {
                if (routsArrData[routKey]["id"] = paginatedData[key]["route_id"]) {
                    paginatedData[key]["route_id"] = routsArrData[routKey]["name"];
                }
            }
            for (guideKey in guideData) {
                if (guideDataArr[guideKey]["id"] = paginatedData[key]["guide_id"]) {
                    paginatedData[key]["guide_name"] = guideDataArr[guideKey]["name"];
                    paginatedData[key]["pricePerHour"] = guideDataArr[guideKey]["pricePerHour"];
                }
            }

            const newRow = document.createElement('tr');
            const th = document.createElement('th');
            th.setAttribute('scope', 'col');
            th.textContent = parseInt(key) + 1;
            newRow.appendChild(th);

            for (prop of propertiesOrder) {
                const th = document.createElement('th');
                th.setAttribute('scope', 'col');
                th.textContent = `${paginatedData[key][prop]}`;
                newRow.appendChild(th);
            }

            const thWithButton = document.createElement('th');
            thWithButton.setAttribute('scope', 'col'); 
            const watchbutton = document.createElement('button');
            watchbutton.className = 'btn';
            watchbutton.innerHTML += `<i class="bi bi-eye"></i>`;
            watchbutton.setAttribute('data-bs-toggle', 'modal');
            watchbutton.setAttribute('data-bs-target', '#exampleModal');
            watchbutton.addEventListener("click", () => {
                document.getElementById("displayGuideName").textContent = "Гид: " + paginatedData[key]["guide_name"];
                document.getElementById("displayRoutName").textContent = "Маршрут: " + paginatedData[key]["route_id"];
                inputDate.value = paginatedData[key]["date"];
                inputDate.disabled = true;
                inputTime.value = paginatedData[key]["time"];
                inputTime.disabled = true;
                inputSelect.value = paginatedData[key]["duration"];
                inputSelect.disabled = true;
                inputPeopleCount.value = paginatedData[key]["persons"];
                inputPeopleCount.disabled = true;
                inputTourGuideCheckBox.checked = paginatedData[key]["optionFirst"];
                inputTourGuideCheckBox.disabled = true;
                inputCarCheckBox.checked = paginatedData[key]["optionSecond"];
                inputCarCheckBox.disabled = true;
                updateCostModal(paginatedData[key]["pricePerHour"]);
                console.log(paginatedData[key]);
            })
            const editbutton = document.createElement('button');
            editbutton.className = 'btn';
            editbutton.innerHTML += `<i class="bi bi-pencil-fill"></i>`;
            const deletebutton = document.createElement('button');
            deletebutton.className = 'btn';
            deletebutton.innerHTML += `<i class="bi bi-trash"></i>`;

            thWithButton.appendChild(watchbutton);
            thWithButton.appendChild(editbutton);
            thWithButton.appendChild(deletebutton);
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
            displayList(arrData, routsData, guideData, rows, currentPage);
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
            displayList(arrData, routsData, guideData, rows, currentPage);
        });

        nextA.appendChild(nextSpan);
        nextLi.appendChild(nextA);
        paginationEl.appendChild(nextLi);

        const buttons = document.querySelectorAll('.pagination .page-link');
        buttons.forEach(button => {
            if (button.textContent.trim() === '1') {
                button.parentElement.classList.add('active');
            }
        });
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
            displayList(data, routsData, guideData, rows, currentPage);
        });
        return liEl;
    }
    displayList(orderData, routsData, guideData, rows, currentPage);
    displayPagination(orderData, rows);

    function updateCostModal(priceHour) {
        const publicHolidaysList = [
            "2024-02-23",
            "2024-03-08",
            "2024-04-29",
            "2024-04-30",
            "2024-05-01",
            "2024-05-09",
            "2024-05-10",
            "2024-06-12",
            "2024-11-04",
            "2024-12-30",
            "2024-12-31",
        ];
    
        const guidePricePerHour = priceHour !== undefined ? priceHour : updateCostModal.guidePricePerHour;
        let dayMultiplier = 1;
    
        let date = new Date(inputDate.value);
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            dayMultiplier = 1.5;
        }
        const formattedDate = date.toISOString().split('T')[0];
        if (publicHolidaysList.includes(formattedDate)) {
            dayMultiplier = 1.5;
        }
    
        const currentTime = new Date(`2000-01-01T${inputTime.value}`);
        const hour = currentTime.getHours();
        const earlyTimeCost = (hour >= 9 && hour <= 12) ? 400 : 0;
        const lateTimeCost = (hour >= 20 && hour <= 23) ? 1000 : 0;
    
        const peopleCountCost = 
        inputPeopleCount.value >= 1 && inputPeopleCount.value <= 5 ? 0 :
        inputPeopleCount.value > 5 && inputPeopleCount.value <= 10 ? 1000 :
        inputPeopleCount.value > 10 && inputPeopleCount.value <= 20 ? 1500 : 0;
     
        let totalPrice = guidePricePerHour * inputSelect.value.split(' ')[0] * dayMultiplier + earlyTimeCost + lateTimeCost + peopleCountCost;
    
        if (inputTourGuideCheckBox.checked) {
            totalPrice *= 1.3;
        }
    
        if (inputCarCheckBox.checked) {
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                totalPrice *= 1.25;
            }
            else {
                totalPrice *= 1.3;
            } 
        }
    
        totalPriceNoString = Math.ceil(totalPrice);
        totalPrice = Math.ceil(totalPrice) + "р";
        console.log(totalPrice);
    
        document.getElementById("totalPriceDisplay").textContent = totalPrice;
    
        updateCostModal.guidePricePerHour = guidePricePerHour;

        // document.getElementById("btnSendOrder").addEventListener("click", async () => {
        //     const sendingOrderData = {
        //         guide_id: selectedTourGuideId,
        //         route_id : selectedRoutId,
        //         date : inputDate.value,
        //         time: inputTime.value,
        //         duration : inputSelect.value.split(' ')[0],
        //         persons : inputPeopleCount.value,
        //         price : totalPriceNoString,
        //         optionFirst : inputTourGuideCheckBox.checked ? 1 : 0,
        //         optionSecond : inputCarCheckBox.checked ? 1 : 0
        //     };
        //     await sendOrderData(sendingOrderData);
        // });
    };
    
    document.getElementById('orderingModal').addEventListener('input', () => {
        updateCostModal()
    });
    
    document.getElementById('orderingModal').addEventListener('change', () => {
        updateCostModal();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    let inputDate = document.getElementById('routDate');

    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let dd = String(today.getDate()).padStart(2, '0');
    let currentDate = yyyy + '-' + mm + '-' + dd;

    inputDate.setAttribute('min', currentDate);
    inputDate.setAttribute('max', yyyy + '-12-31');
    inputDate.value = currentDate;
});

paginationMain()
mainAccount()