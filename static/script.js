const planetsTableBody = document.querySelector('#planets-tbody');
const listDiv = document.querySelector('#small-window-list');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
const closeIcon = document.querySelector('.close');
const closeButton = document.querySelector('#close-modal-btn');
const modal = document.querySelector('#residents-modal');
const modalTableBody = document.querySelector('#modal-table-body');

nextPrevButtons(prev);
nextPrevButtons(next);


window.addEventListener('resize', function (event) {
    if (window.innerWidth < 990) {
        listDiv.classList.remove('inactive');
        document.querySelector('#planets-table').classList.add('inactive')
    } else {
        listDiv.classList.add('inactive');
        document.querySelector('#planets-table').classList.remove('inactive')
    }
});


closeIcon.addEventListener('click', () => modal.classList.add('inactive'));
closeButton.addEventListener('click', () => modal.classList.add('inactive'));
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('inactive');
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


function checkLength(arr, buttonType) {
    if (arr.length !== 0 && buttonType === 'residents') {
        return `<button type="button" className="btn btn-outline-dark residents-btn" data-mdb-ripple-color="dark">${arr.length} resident(s)</button>`;
    } else if (arr.length !== 0 && buttonType === 'vote') {
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
            <td class="residents-btnTd">${checkLength(planet.residents, 'residents')}</td> 
            <td><button type="button" className="btn btn-outline-dark vote-btn" data-mdb-ripple-color="dark">Vote</button></td>     
            `
            pDiv.innerHTML = `
            <p style="font-weight: bold;">${planet.name}</p>
            <p>${planet.diameter !== 'unknown' ? Number(planet.diameter).toLocaleString() + ' km' : 'unknown'}</p>
            <p>${planet.climate}</p>
            <p>${planet.terrain}</p>
            <p>${planet.surface_water !== 'unknown' ? planet.surface_water + '%' : 'unknown'}</p>
            <p>${planet.population !== 'unknown' ? Number(planet.population).toLocaleString() + ' people' : 'unknown'}</p>
            <p class="residents-btnTd">${checkLength(planet.residents, 'vote')}</p>
            <p><button class="vote-btn">Vote</button></p>
            <p></p>
            `
        }
        document.querySelectorAll('.residents-btnTd>button').forEach((x) => {
            x.addEventListener('click', (e) => {
                console.log(e);
                modal.classList.remove('inactive');
            })
        })
    } catch (error) {
        return;
    }
}


getJSON().then(entries => {
    buildPage(entries);
})


function nextPrevButtons(type) {
    type.addEventListener('click', (e) => {
        if (e.detail > 1) {
            return;
        } else {
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