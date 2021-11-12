async function attachEvents() {
    document.getElementById('btnLoad').addEventListener('click', loadContacts);
    document.getElementById('btnCreate').addEventListener('click', onCreate);

    list.addEventListener('click', onDelete);

    loadContacts();
}

const list = document.getElementById('phonebook');
const personInput = document.getElementById('person');
const phoneInput = document.getElementById('phone');

const btnLoad = document.getElementById('btnLoad');

attachEvents();

// delete contact
// Change name of the button "Delete"
// Lock and unlock button
async function onDelete(ev) {
    ev.target.textContent = 'Loading...';
    ev.target.disabled = true;
    const id = ev.target.dataset.id;
    if (id != undefined) {
        await deleteContact(id);
        loadContacts();
    }
}

// create new contact
// Change name of the button "Create"
// Lock and unlock button 
async function onCreate(ev) {
    const btnCreate = ev.target;
    btnCreate.textContent = 'Loading...';
    btnCreate.disabled = true;

    const person = personInput.value;
    const phone = phoneInput.value;
    const contact = { person, phone };

    await createContact(contact);
    list.appendChild(createItem(contact));
    loadContacts();
    btnCreate.textContent = 'Create';
    btnCreate.disabled = false;
}

// load all contacts in the list
// Change name of the button "Load"
// Lock and unlock button 
async function loadContacts() {
    btnLoad.textContent = 'Loading...';
    btnLoad.disabled = true;

    const url = 'http://localhost:3030/jsonstore/phonebook';

    const res = await fetch(url);
    const data = await res.json();

    btnLoad.textContent = 'Load';
    btnLoad.disabled = false;

    list.replaceChildren(...Object.values(data).map(createItem));
}

// create contact
function createItem(contact) {
    const liElement = document.createElement('li');
    liElement.innerHTML = `${contact.person}: ${contact.phone} <button data-id="${contact._id}"">Delete</button>`;
    return liElement;
}

async function createContact(contact) {
    const url = 'http://localhost:3030/jsonstore/phonebook';

    const res = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });

    const result = await res.json();

    return result;
}

async function deleteContact(id) {
    const url = 'http://localhost:3030/jsonstore/phonebook/' + id;

    const res = await fetch(url, {
        method: 'delete'
    });

    const result = await res.json();

    return result;
}