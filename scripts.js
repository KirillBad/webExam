async function getResponse() {
    console.log('eqdqe')
    const apiKey = '3c7a9230-b3c9-4927-99d1-c9180f2d30c8';
    const apiUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes';
    const urlWithApiKey = `${apiUrl}?api_key=${apiKey}`;
    let response = await fetch(urlWithApiKey);
    let content = await response.json();
    let list = document.querySelector('.table');
    let key;
    for (key in content) {
        list.innerHTML += `
            <tr>
                <th scope="col"></th>
                <th scope="col">${content[key].name}</th>
                <th scope="col">${content[key].description}</th>
                <th scope="col">${content[key].mainObject}</th>
            </tr>
        `
    }
    console.log(content)
}

getResponse()