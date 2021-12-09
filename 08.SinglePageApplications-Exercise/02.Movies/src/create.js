// initialization
// - find revalent section

import { showView } from './dom.js';
import { showHome } from './home.js';

// - detach section from DOM
const section = document.getElementById('add-movie');
const form = section.querySelector('form');
form.addEventListener('submit', onCreate);
section.remove();

// display logic
export function showCreate() {
    showView(section);
}

// add new movie to database
// return to home page
// display all movies
async function onCreate(event) {
    event.preventDefault();
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    const formData = new FormData(form);

    const title = formData.get('title').trim();
    const description = formData.get('description').trim();
    const imageUrl = formData.get('imageUrl').trim();

    if (title == "" || description == "" || imageUrl == '') {
        return alert('All fields must be filled !');
    }

    try {
        const res = await fetch('http://localhost:3030/data/movies', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': userData.token
            },
            body: JSON.stringify({ title, description,img:imageUrl })
        });

        if (res.ok == false) {
            const error = await res.json();
            throw new Error(error.message);
        }

        form.reset();
        showHome();
    } catch (err) {
        alert(err.message);
    }
}