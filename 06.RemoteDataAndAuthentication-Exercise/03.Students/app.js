// get request to table body data
async function onLoad() {
    const url = 'http://localhost:3030/jsonstore/collections/students';

    const res = await fetch(url);
    const data = await res.json();

    return Object.values(data);
}

onLoad()

// clear old data in table body
// fill table body with new data
async function fillTable() {
    const student = await onLoad();
    const tableBody = document.querySelector("table tbody");
    tableBody.innerHTML = '';

    student.forEach(st => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${st.firstName}</td>
            <td>${st.firstName}</td>
            <td>${st.facultyNumber}</td>
            <td>${st.grade}</td>`

        tableBody.appendChild(row);
    })
}

fillTable()

// get data from input fields and clear fields
// add action to "Submit" button
// post request to valid data
// display new data in table
const form = document.querySelector('form');
form.addEventListener('submit', onSubmit);

async function onSubmit(event) {
    event.preventDefault();
    const btnSubmit = document.getElementById('submit');

    const data = new FormData(form);

    const firstName = data.get('firstName').trim();
    const lastName = data.get('lastName').trim();
    const facultyNumber = data.get('facultyNumber').trim();
    const grade = data.get('grade').trim();

    if (firstName == "" || lastName == "" || facultyNumber == '' || grade == '') {
        return;
    }

    btnSubmit.textContent  = "Loading...";
    btnSubmit.disabled = true;

    const url = 'http://localhost:3030/jsonstore/collections/students';

    const res = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, facultyNumber, grade })
    });

    const result = await res.json();

    form.reset();
    fillTable();

    btnSubmit.textContent = 'Submit';
    btnSubmit.disabled = false;

    return result;
}