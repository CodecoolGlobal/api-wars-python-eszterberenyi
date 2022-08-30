const tableBody = document.querySelector('tbody');
const listDiv = document.querySelector('#small-window-list');

window.addEventListener('resize', function(event){
    if (window.innerWidth < 990) {
        listDiv.classList.remove('inactive');
        document.querySelector('#my-table').classList.add('inactive')
    } else {
        listDiv.classList.add('inactive');
        document.querySelector('#my-table').classList.remove('inactive')
    }
});


async function getPlanets(pageNum=1) {
    const response = await fetch(
        `https://swapi.py4e.com/api/planets/?page=${pageNum}`,
        {
            method: 'GET',
        }
    );
    return response.json()
}

getPlanets().then(entries => {
    for (let planet of entries.results) {
        console.log(planet);
        let tr = document.createElement('tr');
        tableBody.appendChild(tr);
        for (let i = 0; i <= 7; i++) {
            let td = document.createElement('td');
            let p = document.createElement('p');
            td.classList.add(`cell${i + 1}`);
            tr.appendChild(td);
            listDiv.appendChild(p);
            if (i === 0) {
                td.innerText = planet.name;
                p.innerText = `Name: ${planet.name}`;
                p.style.fontWeight = 'bold';
            }
            else if (i === 1) {
                if (planet.diameter === 'unknown') {
                    td.innerText = 'unknown';
                    p.innerText = 'Diameter: unknown';
                } else {
                    td.innerText = `${Number(planet.diameter).toLocaleString()} km`;
                    p.innerText = `Diameter: ${Number(planet.diameter).toLocaleString()} km`;
                }
            }
            else if (i === 2) {
                    td.innerText = planet.climate;
                    p.innerText = `Climate: ${planet.climate}`;
                }
            else if (i === 3) {
                td.innerText = planet.terrain;
                p.innerText = `Terrain: ${planet.terrain}`;
            }
            else if (i === 4) {
                if (planet.surface_water === 'unknown') {
                    td.innerText = 'unknown';
                    p.innerText = 'Surface Water: unknown';
                } else {
                    td.innerText = `${planet.surface_water}%`;
                    p.innerText = `Surface Water: ${planet.surface_water}%`;
                }
            }
            else if (i === 5) {
                if (planet.population === 'unknown') {
                    td.innerText = 'unknown';
                    p.innerText = 'Population :unknown';
                } else {
                    td.innerText = `${Number(planet.population).toLocaleString()} people`;
                    p.innerText = `Population: ${Number(planet.population).toLocaleString()} people`;
                }
            }
            else if (i === 6) {
                if (planet.residents.length === 0) {
                    td.innerText = 'No known residents';
                    p.innerText = 'Residents: no known residents';
                } else {
                    td.innerHTML = `<button type="button" class="btn btn-outline-dark" data-mdb-ripple-color="dark">${planet.residents.length} resident(s)</button>`;
                    p.innerHTML = `<button>${planet.residents.length} resident(s)</button>`;
                    p.classList.add('residents');
                }
            }
            else if (i === 7) {
                td.innerHTML = '<button type="button" class="btn btn-outline-dark" data-mdb-ripple-color="dark">Vote</button>';
                p.innerHTML = '<button>Vote</button>';
                p.classList.add('vote-btn');
                let p2 = document.createElement('p');
                listDiv.appendChild(p2);
            }
        }
    }
})
