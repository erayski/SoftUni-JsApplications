// initialization
// - find revalent section

import { showView } from './dom.js';
import { showHome } from './home.js';

// - detach section from DOM
const section = document.getElementById('edit-movie');
const form = section.querySelector('form');
form.addEventListener('submit', onEdit);
section.remove();

let idEditMovie = '';
// show form data with info of editing movie
export async function showEdit(id, title, description, img) {
    showView(section);
    idEditMovie = id;
    section.querySelector('[name="title"]').value = title;
    section.querySelector('[name="description"]').value = description;
    section.querySelector('[name="imageUrl"]').value = img;
}

// edit movie + update database
// return to home page
async function onEdit(event) {
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
        const res = await fetch('http://localhost:3030/data/movies/' + idEditMovie, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': userData.token
            },
            body: JSON.stringify({ title, description,imageUrl })
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