const planetsTableBody = document.querySelector('#planets-tbody');
const listDiv = document.querySelector('#small-window-list');
const listDiv2 = document.querySelector('#small-window-list2');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
const closeButton = document.querySelector('#close-modal-btn');
const modalResidents = document.querySelector('#residents-modal');
const modalTableBody = document.querySelector('#modal-table-body');
const modalTableTitle = document.querySelector("#modal-table-title");
const modalRegister = document.querySelector('#user-register-modal');
const modalLogin = document.querySelector('#user-login-modal');
const registrationBtn = document.querySelector('#registration');
const registrationForm = document.querySelector('#registration-form');
const loginBtn = document.querySelector('#login');
const logoutBtn = document.querySelector('#logout')


getJSON().then(entries => {
    buildPage(entries);
})


nextPrevButtons(prev);
nextPrevButtons(next);

// registrationBtn.addEventListener('click', () => {
//     let inputFieldUsername = document.querySelector('#username-register');
//     let inputFieldPassword = document.querySelector('#password-register');
//     let registerBtn = document.querySelector('#register-btn');
//     modalRegister.classList.remove('inactive');
//     registerBtn.addEventListener('click', () => {
//         if (inputFieldUsername.value === '') {
//             inputFieldUsername.setAttribute('placeholder', 'Please provide a username')
//         }
//         if (inputFieldPassword.value === '') {
//             inputFieldPassword.setAttribute('placeholder', 'Please provide a password')
//         }
//     })
// });

// registrationForm.addEventListener('submit', () => {
//     getResponse().then(response => {
//     console.log(response);
//     })
// })
//
// async function getResponse() {
//     const response = await fetch('/');
//     return response.json()
// }

//
// loginBtn.addEventListener('click', () => {
//     const pathArray = window.location.pathname.split('/');
//     if (pathArray.includes('login')) {
//         modalLogin.classList.remove('inactive');
//     }
// })

window.addEventListener('resize', function (event) {
    if (window.innerWidth < 990) {
        listDiv.classList.remove('inactive');
        listDiv2.classList.remove('inactive');
        document.querySelector('#planets-table').classList.add('inactive');
        document.querySelector('#modal-table').classList.add('inactive');
        closeButton.classList.add('inactive')
    } else {
        listDiv.classList.add('inactive');
        listDiv2.classList.add('inactive');
        document.querySelector('#planets-table').classList.remove('inactive')
        document.querySelector('#modal-table').classList.remove('inactive');
        closeButton.classList.remove('inactive')
    }
});


closeButton.addEventListener('click', () => modalResidents.classList.add('inactive'));
window.addEventListener('click', (e) => {
    if (e.target === modalResidents || e.target === modalRegister) {
        modalResidents.classList.add('inactive');
    }
})


async function getJSON(pageNum = 1) {
    const response = await fetch(
        `https://swapi.py4e.com/api/planets?page=${pageNum}`,
        {
            method: 'GET',
        }
    );
    return response.json()
}


function createButton(arr, buttonType) {
    if (arr.length !== 0 && buttonType === 'residents') {
        return `<button type="button" className="btn btn-outline-dark residents-btn" data-mdb-ripple-color="dark">${arr.length} resident(s)</button>`;
    } else if (arr.length !== 0 && buttonType === 'residentsList') {
        return `<button class="residents-btn">${arr.length} resident(s)</button>`
    } else {
        return 'No known residents';
    }
}


function buildPage(entries) {
    try {
        for (let planet of entries.results) {
            let tr = document.createElement('tr');
            let pDiv = document.createElement('div');
            planetsTableBody.appendChild(tr);
            listDiv.appendChild(pDiv)
            tr.innerHTML = `
            <td>${planet.name}</td>
            <td>${planet.diameter !== 'unknown' ? Number(planet.diameter).toLocaleString() + ' km' : 'unknown'}</td>
            <td>${planet.climate}</td>
            <td>${planet.terrain}</td>
            <td>${planet.surface_water !== 'unknown' ? planet.surface_water + '%' : 'unknown'}</td>
            <td>${planet.population !== 'unknown' ? Number(planet.population).toLocaleString() + ' people' : 'unknown'}</td>      
            <td class="residents-btnTd">${createButton(planet.residents, 'residents')}</td> 
            <td><button type="button" className="btn btn-outline-dark vote-btn" data-mdb-ripple-color="dark">Vote</button></td>     
            `
            pDiv.innerHTML = `
            <p style="font-weight: bold;">Name: ${planet.name}</p>
            <p>${planet.diameter !== 'unknown' ? 'Diameter: ' + Number(planet.diameter).toLocaleString() + ' km' : 'Diameter: unknown'}</p>
            <p>Climate: ${planet.climate}</p>
            <p>Terrain: ${planet.terrain}</p>
            <p>${planet.surface_water !== 'unknown' ? 'Surface water: ' + planet.surface_water + '%' : 'Surface water: unknown'}</p>
            <p>${planet.population !== 'unknown' ? 'Population: ' + Number(planet.population).toLocaleString() + ' people' : 'Population: unknown'}</p>
            <p class="residents-btnTd">${createButton(planet.residents, 'residentsList')}</p>
            <p><button class="vote-btn">Vote</button></p>
            <p></p>
            `
            if (planet.residents.length !== 0) {
                listenerToBuildModal(tr, 2, planet.residents, planet.name);
                listenerToBuildModal(pDiv, 3, planet.residents, planet.name);
            }
        }
    } catch (error) {}
}


function listenerToBuildModal(tagType, childNum, residents, planetName) {
    tagType.querySelector(`.residents-btnTd:nth-last-child(${childNum})>button`).addEventListener('click', () => {
        buildModalResidents(residents, planetName);
    });
}

function nextPrevButtons(type) {
    type.addEventListener('click', (e) => {
        if (e.detail > 1) {} else {
            let pageNum = parseInt(type.dataset.page);
            if (type === prev) {
                pageNum -= 1;
                if (pageNum === 1) {
                    prev.classList.add('inactive');
                } else if (pageNum !== 7) {
                    next.classList.remove('inactive');
                }
            } else {
                pageNum += 1;
                if (pageNum === 7) {
                    next.classList.add('inactive');
                } else if (pageNum !== 1) {
                    prev.classList.remove('inactive');
                }
            }
            getJSON(pageNum).then(entries => {
                if (entries.detail !== 'Not found') {
                    planetsTableBody.textContent = '';
                    listDiv.textContent = '';
                    prev.dataset.page = pageNum.toString();
                    next.dataset.page = pageNum.toString();
                    buildPage(entries)
                }
            })
        }
    })
}


async function fetchResident(residentSource) {
    const response = await fetch(residentSource);
    return response.json()
}

async function gatherResidents(residents) {
    const residentData = [];
    for (let resident of residents) {
        let res = await fetchResident(resident);
        residentData.push(res);
    }
    return residentData
}

async function buildModalResidents(residents, planetName) {
    modalTableBody.textContent = '';
    modalResidents.classList.remove("inactive");
    const residentData = await gatherResidents(residents);
    modalTableTitle.textContent = `Resident(s) of: ${planetName}`;
    residentData.forEach((resident) => {
        const tr = createAndAppendNode('tr', modalTableBody);
        createAndAppendNode('td', tr, resident.name);
        resident.height === 'unknown' ? createAndAppendNode('td', tr, 'unknown') : createAndAppendNode('td', tr, `${resident.height} m`);
        resident.mass === 'unknown' ? createAndAppendNode('td', tr, 'unknown') : createAndAppendNode('td', tr, `${resident.mass} kg`);
        createAndAppendNode('td', tr, resident.skin_color);
        createAndAppendNode('td', tr, resident.hair_color);
        createAndAppendNode('td', tr, resident.eye_color);
        createAndAppendNode('td', tr, resident.birth_year);
        createAndAppendNode('td', tr, resident.gender);
        const pDiv = createAndAppendNode('div', listDiv2);
        const nameP = createAndAppendNode('p', pDiv, `Name: ${resident.name}`);
        resident.height === 'unknown' ? createAndAppendNode('p', pDiv, 'Height: unknown') : createAndAppendNode('p', pDiv, `Height: ${resident.height} m`);
        resident.mass === 'unknown' ? createAndAppendNode('p', pDiv, 'Weight: unknown') : createAndAppendNode('p', pDiv, `Weight: ${resident.mass} kg`);
        createAndAppendNode('p', pDiv, `Skin color: ${resident.skin_color}`);
        createAndAppendNode('p', pDiv, `Hair color: ${resident.hair_color}`);
        createAndAppendNode('p', pDiv, `Eye color: ${resident.eye_color}`);
        createAndAppendNode('p', pDiv, `Birth year: ${resident.birth_year}`);
        createAndAppendNode('p', pDiv, `Gender: ${resident.gender}`);
        createAndAppendNode('p', pDiv);
        nameP.style.fontWeight = 'bold'
    })
}


function buildModalUserFeatures(feature) {

}

function createAndAppendNode(tagName, parentNode, tagContent, className) {
    let node = document.createElement(tagName);
    node.textContent = tagContent;
    node.classList.add(className);
    parentNode.append(node);
    return node;
}

