let userData = null;

window.addEventListener('DOMContentLoaded', () => {
    const createForm = document.getElementById('createForm');
    createForm.addEventListener('submit', onCreate);

    userData = JSON.parse(sessionStorage.getItem('userData'));

    document.getElementById('buyBtn').addEventListener('click', onBuy);
    document.getElementById('allOrders').addEventListener('click', onOrder);

    onLoad();
})

// update current table
async function onLoad() {
    try {
        const res = await fetch('http://localhost:3030/data/furniture');
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        const data = await res.json();
        for (let el of data) {
            updateRow(el);
        }

    } catch (err) {
        alert(err.message);
    }
}

async function onOrder(event) {
    event.preventDefault();
    const btn = document.getElementById('allOrders');
    btn.textContent = 'Loading...';
    btn.disabled = true;
    
    try {
        const res = await fetch(`http://localhost:3030/data/orders?where=_ownerId%3D"${userData.id}"`);
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        const data = await res.json();
        let [bought, totalPr] = [...document.querySelector('.orders').children];

        const furnitures = [];
        let price = 0;
        for (let el of data) {
            furnitures.push(el.name);
            price += Number(el.price);
        }

        bought.innerHTML = `Bought furniture: <span>${furnitures.join(', ')}</span>`;
        totalPr.innerHTML = `Total price: <span>${price} $</span>`;

    } catch (err) {
        alert(err.message);
    }
    btn.textContent = 'All orders';
    btn.disabled = false;
}

async function onBuy(event) {
    event.preventDefault();
    const btn = document.getElementById('buyBtn');
    btn.textContent = 'Loading...';
    btn.disabled = true;

    const allCheckbox = document.querySelectorAll('input[type=checkbox]');

    for (let check of allCheckbox) {

        if (check.checked == true) {
            const row = check.parentElement.parentElement.children;
            let [img, name, price, factor] = [...row];

            img = img.firstElementChild.src;
            name = name.textContent.trim();
            price = price.textContent.trim();
            factor = factor.textContent.trim();

            try {
                const res = await fetch('http://localhost:3030/data/orders', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Authorization': userData.token
                    },
                    body: JSON.stringify({ name, price, factor, img })
                })

            } catch (err) {
                alert(err.message);
            }
        }
    }
    btn.textContent = 'Buy';
    btn.disabled = false;
}

// add furniture to table
// make post request
async function onCreate(event) {
    event.preventDefault();
    const btn = document.getElementById('createBtn');
    btn.textContent = "Loading...";
    btn.disabled = true;

    const formData = new FormData(event.target);

    const name = formData.get('name');
    const price = formData.get('price');
    const factor = formData.get('factor');
    const img = formData.get('img');


    if (name == '' || price == '' || factor == '' || img == '') {
        alert('All fields must be full!');
        return;
    }

    try {
        const res = await fetch('http://localhost:3030/data/furniture', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': userData.token
            },
            body: JSON.stringify({ name, price, factor, img, id: userData.id })
        })

        const table = document.querySelector('tbody');
        const row = e('tr', {},
            e('td', {}, e('img', { src: img })),
            e('td', {}, e('p', {}, name)),
            e('td', {}, e('p', {}, price)),
            e('td', {}, e('p', {}, factor)),
            e('td', {}, e('input', { type: "checkbox" },)),
        )
        table.appendChild(row);
        event.target.reset();
    } catch (err) {
        alert(err.message);
    }
    btn.textContent = "Create";
    btn.disabled = false;
}

function updateRow(data) {
    const table = document.querySelector('tbody');
    const row = e('tr', {},
        e('td', {}, e('img', { src: data.img })),
        e('td', {}, e('p', {}, data.name)),
        e('td', {}, e('p', {}, data.price)),
        e('td', {}, e('p', {}, data.factor)),
        e('td', {}, e('input', { type: "checkbox" },)),
    )
    table.appendChild(row);
}

// create HTML element
function e(type, attr, ...content) {
    const element = document.createElement(type);

    for (let prop in attr) {
        element[prop] = attr[prop];
    }
    for (let item of content) {
        if (typeof item == 'string' || typeof item == 'number') {
            item = document.createTextNode(item);
        }
        element.appendChild(item);
    }
    return element;
}