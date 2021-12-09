import { e, showView } from './dom.js';
import { showCreate } from './create.js';
import { showDetails } from './details.js';

// initialization
// - find revalent section
// - detach section from DOM

// make limit to refresh time
let moviesCache = null;
let lastLoaded = null;
const maxAge = 5000; // = 5 seconds or -> nice to be 60000 = 1 min

const section = document.getElementById('home-page');
const catalog = document.querySelector('.card-deck.d-flex.justify-content-center');

section.querySelector('#createLink').addEventListener('click', (event) => {
    event.preventDefault();
    showCreate();
})

catalog.addEventListener('click', (event) => {
    event.preventDefault();
    let target = event.target;
    if (target.tagName == 'BUTTON') {
        target = target.parentElement;
    }
    if (target.tagName == 'A') {
        const id = target.dataset.id;
        showDetails(id);
    }
})

section.remove();

// display logic
export function showHome() {
    showView(section);
    getMovies();
}

// load and create all movies from database to home page
async function getMovies() {
    catalog.replaceChildren(e('p', {}, 'Loading...'));

    const now = Date.now();
    if (moviesCache == null || (now - lastLoaded) > maxAge) {
        lastLoaded = now;
        const res = await fetch('http://localhost:3030/data/movies');
        const data = await res.json();

        moviesCache = data;
    }

    catalog.replaceChildren(...moviesCache.map(createMovieCard));
}

function createMovieCard(movie) {
    const element = e('div', { className: 'card mb-4' });
    element.innerHTML = `
    <img class="card-img-top" src="${movie.img}"
        alt="Card image cap" width="400">
    <div class ="card-body">
        <h4 class ="card-title">${movie.title}</h4>
    </div>
    <div class ="card-footer">
        <a data-id=${movie._id} href="#">
            <button type ="button" class ="btn btn-info">Details</button>
        </a>
    </div>`;

    return element;
}

/* Example of movie card:
<div class="card mb-4">
    <img class="card-img-top" src="https://pbs.twimg.com/media/ETINgKwWAAAyA4r.jpg"
        alt="Card image cap" width="400">
    <div class ="card-body">
    <h4 class ="card-title">Wonder Woman 1984</h4>
    </div>
    <div class ="card-footer">
    <a href="#/details/6lOxMFSMkML09wux6sAF">
    <button type ="button" class ="btn btn-info">Details</button>
    </a>
    </div>
</div>
*/