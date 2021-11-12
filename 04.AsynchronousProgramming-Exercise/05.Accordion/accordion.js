window.onload = solution();

async function solution() {
    const main = document.getElementById("main")
    main.innerHTML = '';

    // get all titles and their _id
    // display divs in main with them
    const allTitles = await getId();
    for (let obj of allTitles) {
        const button = document.createElement('button');
        button.textContent = 'More';
        button.setAttribute('class', 'button');
        button.setAttribute('id', obj._id);

        const accordion = e('div', { className: "accordion" },
            e('div', { className: "head" },
                e('span', {}, obj.title),
                button
            ),
            e('div', { className: "extra" },
                e('p', {},)
            )
        )
        main.appendChild(accordion);
    }

    main.addEventListener('click', onButton);
}

async function onButton(ev) {
    // check if clicked is button
    // change the button text
    // show content if it's More
    // make reverse action of button - More/Less
    const btn = ev.target;
    btn.disabled = true;
    if (btn.tagName == 'BUTTON') {
        if (btn.textContent == "More") {
            btn.textContent = "Loading...";
            let info = await getContent(btn.id);
            btn.textContent = "Less";
            btn.parentElement.nextSibling.style.display = 'block';
            btn.parentElement.nextSibling.firstChild.textContent = info.content;
        } else {
            btn.textContent = "More";
            btn.parentElement.nextSibling.style.display = 'none';
        }
    }
    btn.disabled = false;

}

async function getContent(id) {
    const url = 'http://localhost:3030/jsonstore/advanced/articles/details/' + id;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        data = await res.json();
    } catch (error) {
        alert(error.message);
    }

    return data;
}

async function getId() {
    const url = 'http://localhost:3030/jsonstore/advanced/articles/list';

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        data = await res.json();
    } catch (error) {
        alert(error.message);
    }

    return data;
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