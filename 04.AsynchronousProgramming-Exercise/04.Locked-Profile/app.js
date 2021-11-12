async function lockedProfile() {
    const url = 'http://localhost:3030/jsonstore/advanced/profiles';
    let profiles;

    // handle error
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        profiles = await res.json();
    } catch (error) {
        alert(error.message);
    }

    let mainDiv = document.querySelector('#main');

    Object.values(profiles)
    .forEach(person => {
        mainDiv.appendChild(createProfile(person));
    });    
    document.querySelectorAll('.profile')[0].remove();
}

function createProfile(person) {
    const currProfile = e('div', { className: 'profile' },
        e('img', { src: "./iconProfile2.png", className: "userIcon" }),
        e('label', {}, "Lock"),
        e('input', { type: "radio", name: "user1Locked", value: 'lock', checked: true }),
        e('label', {}, "Unlock"),
        e('input', { type: "radio", name: "user1Locked", value: 'unlock' }),
        e('br'),
        e('hr'),
        e('label', {}, 'Username'),
        e('input', {
            type: "text", name: "user1Username", value: person.username,
            disabled: true, readOnly: true
        }),
        e('div', { id: "user1HiddenFields" },
            e('hr'),
            e('label', {}, "Email:"),
            e('input', {
                type: 'email', name: 'userEmail',
                value: person.email, disabled: true, readOnly: true
            }),
            e('label', {}, "Age"),
            e('input', {
                type: 'email', name: 'userAge',
                value: person.age, disabled: true, readonly: true
            })
        ),
        e('button', {}, 'Show more')
    )

    currProfile
        .querySelector('button')
        .addEventListener('click', () => showHidden(currProfile));
    return currProfile;
}

function showHidden(info) {
    const hidden = info.querySelector('#user1HiddenFields');
    const button = info.querySelector('button');
    const checked =info.querySelectorAll('input')[1].checked;

    if (checked == true && button.textContent == "Show more") {
        hidden.style.display = 'block';
        button.textContent = 'Hide it';
    } else if (checked == true && button.textContent == "Hide it") {
        hidden.style.display = 'none';
        button.textContent = 'Show more';
    }
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