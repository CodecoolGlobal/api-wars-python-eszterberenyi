const tableBody = document.querySelector('tbody');
const listDiv = document.querySelector('#small-window-list');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');

window.addEventListener('resize', function(event){
    if (window.innerWidth < 990) {
        listDiv.classList.remove('inactive');
        document.querySelector('#my-table').classList.add('inactive')
    } else {
        listDiv.classList.add('inactive');
        document.querySelector('#my-table').classList.remove('inactive')
    }
});


async function getJSON(pageNum=1) {
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
    }
    else if (arr.length !== 0 && buttonType === 'vote') {
        return `<button>${arr.length} resident(s)</button>`
    } else {
        return 'No known residents';
    }
}


function buildPage(entries) {
    try {
        for (let planet of entries.results) {
            let tr = document.createElement('tr');
            let pDiv = document.createElement('div');
            tableBody.appendChild(tr);
            listDiv.appendChild(pDiv)
            tr.innerHTML = `
            <td>${planet.name}</td>
            <td>${planet.diameter !== 'unknown' ? Number(planet.diameter).toLocaleString() + ' km' : 'unknown'}</td>
            <td>${planet.climate}</td>
            <td>${planet.terrain}</td>
            <td>${planet.surface_water !== 'unknown' ? planet.surface_water + '%' : 'unknown'}</td>
            <td>${planet.population !== 'unknown' ? Number(planet.population).toLocaleString() + ' people' : 'unknown'}</td>      
            <td>${checkLength(planet.residents, 'residents')}</td> 
            <td><button type="button" className="btn btn-outline-dark vote-btn" data-mdb-ripple-color="dark">Vote</button></td>     
            `
            pDiv.innerHTML = `
            <p style="font-weight: bold;">${planet.name}</p>
            <p>${planet.diameter !== 'unknown' ? Number(planet.diameter).toLocaleString() + ' km' : 'unknown'}</p>
            <p>${planet.climate}</p>
            <p>${planet.terrain}</p>
            <p>${planet.surface_water !== 'unknown' ? planet.surface_water + '%' : 'unknown'}</p>
            <p>${planet.population !== 'unknown' ? Number(planet.population).toLocaleString() + ' people' : 'unknown'}</p>
            <p>${checkLength(planet.residents, 'vote')}</p>
            <p><button>Vote</button></p>
            <p></p>
            `
        }
    } catch (error) {
        return;
    }
}


getJSON().then(entries => {
    buildPage(entries);
})


prev.addEventListener('click', (e) => {
    if(e.detail > 1) {
        return;
    } else {
        let pageNum = parseInt(prev.dataset.page);
        pageNum -= 1;
        getJSON(pageNum).then(entries => {
            if (entries.detail !== 'Not found') {
                tableBody.textContent = '';
                listDiv.textContent = '';
                prev.dataset.page = pageNum.toString();
                next.dataset.page = pageNum.toString();
                buildPage(entries)
            }
        })
    }
})

next.addEventListener('click', (e) => {
    if(e.detail > 1) {
        return;
    } else {
        let pageNum = parseInt(next.dataset.page);
        pageNum += 1;
        getJSON(pageNum).then(entries => {
            if (entries.detail !== 'Not found') {
                console.log(entries);
                tableBody.textContent = '';
                listDiv.textContent = '';
                prev.dataset.page = pageNum.toString();
                next.dataset.page = pageNum.toString();
                buildPage(entries)
            }
        })
    }
})