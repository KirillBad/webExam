const apiKey = '3c7a9230-b3c9-4927-99d1-c9180f2d30c8';
async function getRoutsData() {
    try {
        const apiUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes';
        const urlWithApiKey = `${apiUrl}?api_key=${apiKey}`;
        let response = await fetch(urlWithApiKey);
        let content = await response.json();
        return content;
    } catch (error) {
        console.error('Ошибка загрузки данных маршрутов:', error);
    }
};

async function getRoutGuidesData(routId) {
    try {
        const apiUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${routId}/guides`;
        const urlWithApiKey = `${apiUrl}?api_key=${apiKey}`;
        let response = await fetch(urlWithApiKey);
        let content = await response.json();
        return content;
    } catch (error) {
        console.error('Ошибка загрузки данных гидов:', error);
    }
};

async function sendOrderData(data) {
    try {
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
        return content;
    } catch (error) {
        console.error('Ошибка отправки данных заказа:', error);
    }
};

async function getOrderData() {
    try {
        const apiUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders`;
        const urlWithApiKey = `${apiUrl}?api_key=${apiKey}`;
        let response = await fetch(urlWithApiKey);
        let content = await response.json();
        return content;
    } catch (error) {
        console.error('Ошибка загрузки данных заказа:', error);
    }
};

async function deleteOrder(orderId) {
    try {
        const apiUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/${orderId}`;
        const urlWithApiKey = `${apiUrl}?api_key=${apiKey}`;
        let response = await fetch(urlWithApiKey, {
            method : "DELETE", 
            headers : {
                'Content-Type': 'application/json'
            }
        });
        let content = await response.json();
        return content;
    } catch (error) {
        console.error('Ошибка удаления данных заказа:', error);
    }
}

async function updateOrder(orderId, data) {
    try {
        const apiUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/${orderId}`;
        const urlWithApiKey = `${apiUrl}?api_key=${apiKey}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data).toString()
        };
        let response = await fetch(urlWithApiKey, requestOptions);
        let content = await response.json();
        return content;
    } catch (error) {
        console.error('Ошибка обновления данных заказа:', error);
    }
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
};

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
                const allRows = tableEl.getElementsByTagName('tr');
                for (const row of allRows) {
                    row.classList.remove('selected');
                }
                newRow.classList.add("selected")
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

        if (selectEl.value === "Выбрать") {
            let searchText = e.target.value.toLowerCase();
            const filteredData = trimedData.filter(item =>
                item.name.toLowerCase().includes(searchText)
            );
            displayList(filteredData, rows, currentPage);
            displayPagination(filteredData, rows);
        }
        else {
            let selectedValue = document.getElementById("routsSelect").value;
            const filteredDataSelect = trimedData.filter(item =>
                item.mainObject.toLowerCase().includes(selectedValue.toLowerCase()));
            let searchText = e.target.value.toLowerCase();
            const filteredData = filteredDataSelect.filter(item =>
                item.name.toLowerCase().includes(searchText)
            );
            displayList(filteredData, rows, currentPage);
            displayPagination(filteredData, rows);
        }
    })

    document.getElementById("routsSelect").addEventListener("change", function() {
        const selectedValue = this.value;

        searchValue = document.getElementById("routsSearch").value.toLowerCase();

        if (searchValue != "") {
            const filteredDataSearch = trimedData.filter(item =>
                item.name.toLowerCase().includes(searchValue)
            );
            if (selectedValue !== "Выбрать") {
                const filteredData = filteredDataSearch.filter(item =>
                    item.mainObject.toLowerCase().includes(selectedValue.toLowerCase())
                );
                displayList(filteredData, rows, currentPage);
                displayPagination(filteredData, rows);
            }
            else {
                displayList(filteredDataSearch, rows, 1); 
                displayPagination(filteredDataSearch, rows);
            }
        }
        else {
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
        }
    })

    displayList(trimedData, rows, currentPage);
    displayPagination(trimedData, rows);
    displaySelect(trimedData);

    let selectedTourGuideId = null;
    async function mainTourGuidesData(id, routName){
        selectedRoutId = id;

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

    let inputDate = document.getElementById('date');
    let inputTime = document.getElementById('routTime');
    let inputSelect = document.getElementById('selectHours');
    let inputPeopleCount = document.getElementById('peopleCount');
    let inputTourGuideCheckBox = document.getElementById('tourGuideCheckBox');
    let inputCarCheckBox = document.getElementById('carCheckBox');
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
        const minutes = currentTime.getMinutes();
        if ((hour < 9 || hour > 23) && (minutes !== 0 && minutes !== 30)) {

        };

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
    };

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

        const toastLiveExampleTime = document.getElementById('orderTime')
        const toastBootstrapTime = bootstrap.Toast.getOrCreateInstance(toastLiveExampleTime)

        const currentTime = new Date(`2000-01-01T${sendingOrderData.time}`);
        const hour = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        if (((hour >= 9 && hour < 23) && (minutes === 0 || minutes === 30)) || (hour === 23 && minutes === 0)) {
            await sendOrderData(sendingOrderData);
            const toastLiveExampleConfirm = document.getElementById('orderConfirm');
            const toastBootstrapConfirm = bootstrap.Toast.getOrCreateInstance(toastLiveExampleConfirm);
            toastBootstrapConfirm.show();
        }
        else {
            toastBootstrapTime.show();
        };
    });
    
    document.getElementById('orderingModal').addEventListener('input', () => {
        updateCostModal()
    });
    
    document.getElementById('orderingModal').addEventListener('change', () => {
        updateCostModal();
    });
};

async function mainAccount () {
    let currentPage = 1;
    let rows = 5;
    const orderData = await getOrderData();
    const routsData = await getRoutsData();

    // const orderData = testOrderData;
    // const routsData = testRoutsData;

    const getRoutGuidesPromises = orderData.map(async (order) => {
        const routGuideData = await getRoutGuidesData(order["route_id"]);
        const guide = routGuideData.find(g => g['id'] === order['guide_id']);

        if (guide) {
            order["pricePerHour"] = guide['pricePerHour'];
            order["guide_name"] = guide['name'];
        }

        return order;
    });

    const updatedOrderData = await Promise.all(getRoutGuidesPromises);

    let inputDate = document.getElementById('date');
    let inputTime = document.getElementById('time');
    let inputSelect = document.getElementById('duration');
    let inputPeopleCount = document.getElementById('persons');
    let inputTourGuideCheckBox = document.getElementById('optionFirst');
    let inputCarCheckBox = document.getElementById('optionSecond');

    let modalData = {};

    function displayList(arrData, routsArrData, rowsPerPage, page) {
        const tableEl = document.getElementById('tableOrders');
        tableEl.innerHTML = ''; 
        page--;
        const start = rowsPerPage * page;
        const end = start + rowsPerPage;
        const paginatedData = arrData.slice(start, end);
        const propertiesOrder = ['route_id', 'date', 'price'];

        for (let key in paginatedData) {
            for (let routKey in routsArrData) {
                if (routsArrData[routKey]["id"] === paginatedData[key]["route_id"]) {
                    paginatedData[key]["route_id"] = routsArrData[routKey]["name"];
                };
            };

            const newRow = document.createElement('tr');
            const th = document.createElement('th');
            th.setAttribute('scope', 'col');
            th.textContent = parseInt(key) + 1;
            newRow.appendChild(th);

            for (let prop of propertiesOrder) {
                const th = document.createElement('th');
                th.setAttribute('scope', 'col');
                th.textContent = `${paginatedData[key][prop]}`;
                newRow.appendChild(th);
            };

            const thWithButton = document.createElement('th');
            thWithButton.setAttribute('scope', 'col'); 
            const watchbutton = document.createElement('button');
            watchbutton.className = 'btn';
            watchbutton.innerHTML += `<i class="bi bi-eye"></i>`;
            watchbutton.setAttribute('data-bs-toggle', 'modal');
            watchbutton.setAttribute('data-bs-target', '#exampleModal');
            watchbutton.addEventListener("click", () => {
                document.getElementById("exampleModalLabel").textContent = "Заявка номер " + paginatedData[key]["id"]
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
                document.querySelector(".modal-footer").className = "modal-footer d-none";
                updateCostModal(paginatedData[key]["pricePerHour"]);
            });
            const editbutton = document.createElement('button');
            editbutton.className = 'btn';
            editbutton.innerHTML += `<i class="bi bi-pencil-fill"></i>`;
            editbutton.setAttribute('data-bs-toggle', 'modal');
            editbutton.setAttribute('data-bs-target', '#exampleModal');
            editbutton.addEventListener("click", () => {
                document.getElementById("exampleModalLabel").textContent = "Редактирование заявки " + paginatedData[key]["id"]
                document.getElementById("displayGuideName").textContent = "Гид: " + paginatedData[key]["guide_name"];
                document.getElementById("displayRoutName").textContent = "Маршрут: " + paginatedData[key]["route_id"];
                const updatedData = {};
                inputDate.value = paginatedData[key]["date"];
                inputDate.disabled = false;
                if (inputDate.value !== paginatedData[key]["date"]) {
                    updatedData.date = inputDate.value;
                };
                inputTime.value = paginatedData[key]["time"];
                inputTime.disabled = false;
                inputSelect.value = paginatedData[key]["duration"];
                inputSelect.disabled = false;
                inputPeopleCount.value = paginatedData[key]["persons"];
                inputPeopleCount.disabled = false;
                inputTourGuideCheckBox.checked = paginatedData[key]["optionFirst"];
                inputTourGuideCheckBox.disabled = false;
                inputCarCheckBox.checked = paginatedData[key]["optionSecond"];
                inputCarCheckBox.disabled = false;
                document.querySelector(".modal-footer").className = "modal-footer";
                updateCostModal(paginatedData[key]["pricePerHour"]);
            });
            editbutton.addEventListener("click", (function(currentKey) {
                return function() {
                    document.getElementById("editOrderBtn").addEventListener("click", async () => {
                        let idForSelect = paginatedData[currentKey]["id"];
                        const currentTime = new Date(`2000-01-01T${modalData.time}`);
                        const hour = currentTime.getHours();
                        const minutes = currentTime.getMinutes();
                        if (((hour >= 9 && hour < 23) && (minutes === 0 || minutes === 30)) || (hour === 23 && minutes === 0)) {
                            await updateOrder(idForSelect, modalData);
                            const toastLiveExampleConfirm = document.getElementById('updateOrder');
                            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExampleConfirm);
                            toastBootstrap.show();
                            mainAccount();
                        }
                        else {     
                            const toastLiveExampleTime = document.getElementById('orderTime')
                            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExampleTime)               
                            toastBootstrap.show();
                        };
                    });
                };
            })(key));

            const deletebutton = document.createElement('button');
            deletebutton.className = 'btn';
            deletebutton.innerHTML += `<i class="bi bi-trash"></i>`;
            deletebutton.setAttribute('data-bs-toggle', 'modal');
            deletebutton.setAttribute('data-bs-target', '#deleteModal');
            deletebutton.addEventListener("click", (function(currentKey) {
                return function() {
                    document.getElementById("deleteConfirmBtn").addEventListener("click", async () => {
                        let idForDelete = paginatedData[currentKey]["id"];
                        await deleteOrder(idForDelete);
                        mainAccount();
                    });
                };
            })(key));

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
            displayList(arrData, routsData, rows, currentPage);
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
            displayList(arrData, routsData, rows, currentPage);
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
            displayList(data, routsData, rows, currentPage);
        });
        return liEl;
    }

    displayList(updatedOrderData, routsData, rows, currentPage);
    displayPagination(updatedOrderData, rows);

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

        document.getElementById("totalPriceDisplay").textContent = totalPrice;
    
        updateCostModal.guidePricePerHour = guidePricePerHour;

        return totalPriceNoString 
    };
    
    document.getElementById('orderingModal').addEventListener('input', (event) => {
        const target = event.target;

        if (target.type === 'checkbox') {
            modalData[target.id] = target.checked ? 1 : 0;
        } else {
            modalData[target.id] = target.value;
        }
        modalData["price"] = updateCostModal()
    });
    
    document.getElementById('orderingModal').addEventListener('change', (event) => {
        const target = event.target;

        if (target.type === 'checkbox') {
            modalData[target.id] = target.checked ? 1 : 0;
        } else {
            modalData[target.id] = target.value;
        }
        modalData["price"] = updateCostModal()
    });
}

document.addEventListener('DOMContentLoaded', function () {
    let inputDate = document.getElementById('date');

    let today = new Date();
    today.setDate(today.getDate() + 1);
    let yyyy = today.getFullYear();
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let dd = String(today.getDate()).padStart(2, '0');
    let currentDate = yyyy + '-' + mm + '-' + dd;

    inputDate.setAttribute('min', currentDate);
    inputDate.setAttribute('max', yyyy + '-12-31');
    inputDate.value = currentDate;
});

const toastTriggerDelete = document.getElementById('deleteConfirmBtn')
const toastLiveExampleDelete = document.getElementById('deleteOrder')
if (toastTriggerDelete) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExampleDelete)
  toastTriggerDelete.addEventListener('click', () => {
    toastBootstrap.show()
  })
}

const toastTriggerUpdate = document.getElementById('deleteConfirmBtn')
const toastLiveExampleUpdate = document.getElementById('deleteOrder')
if (toastTriggerUpdate) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExampleUpdate)
  toastTriggerUpdate.addEventListener('click', () => {
    toastBootstrap.show()
  })
}
paginationMain();
mainAccount();