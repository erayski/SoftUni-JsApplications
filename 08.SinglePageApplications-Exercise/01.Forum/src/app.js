import { addNewTopic } from './views/create.js';
import { showHomePage } from './views/home.js';

showHomePage();
document.querySelector('header .homeBtn').addEventListener('click', (ev) => {
    ev.preventDefault();
    showHomePage();
});

// create new topic
document.querySelector('.public').addEventListener('click', addNewTopic);

// empty fields when click "Cancel"
document.querySelector('.cancel').addEventListener('click', (ev) => {
    ev.preventDefault();
    const form = ev.target.parentNode.parentNode;
    form.reset();
});