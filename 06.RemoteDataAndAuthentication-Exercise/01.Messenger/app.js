attachEvents();

function attachEvents() {
    // add event listener to load button
    const refreshbtn = document.getElementById('refresh');
    refreshbtn.addEventListener('click', load);

    // add event listener to post button
    const submitBtn = document.getElementById('submit');
    submitBtn.addEventListener('click', onSubmit);

    load();
}

const authorInput = document.querySelector('[name="author"]');
const contentInput = document.querySelector('[name="content"]');
const list = document.getElementById('messages');


// add single message to list
async function onSubmit() {
    const author = authorInput.value;
    const content = contentInput.value;

    const result = await create({ author, content });

    // display all messages and clear input fields
    authorInput.value = '';
    contentInput.value = '';
    list.value += '\n' + `${author}: ${content}`;
}


// load messages
async function load() {
    const url = 'http://localhost:3030/jsonstore/messenger';
    const res = await fetch(url);
    const data = await res.json();

    const messages = Object.values(data);

    list.value = messages
        .map(m => `${m.author}: ${m.content}`)
        .join('\n');

    return messages;
}


// post message
async function create(message) {
    const url = 'http://localhost:3030/jsonstore/messenger';
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    }

    const res = await fetch(url, options);
    const result = await res.json();

    return result;
}