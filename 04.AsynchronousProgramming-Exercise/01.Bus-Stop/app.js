async function getInfo() {
    const stopNameEl = document.getElementById('stopName');
    const timeTableEl = document.getElementById('buses');

    // read input value
    const stopId = document.getElementById('stopId').value;
    const url = `http://localhost:3030/jsonstore/bus/businfo/${stopId}`;

    // make request to server
    // parse response data
    // display data
    // error checking for request
    // The list should be cleared before every request is sent
    try {
        stopNameEl.textContent = "Loading..."
        timeTableEl.replaceChildren();

        const res = await fetch(url);
        if (res.status != 200) {
            throw new Error('Stop Id not found');
        }
        const data = await res.json();

        stopNameEl.textContent = data.name;

        Object.entries(data.buses).forEach(stopId => {
            const liElement = document.createElement('li');
            liElement.textContent = `Bus ${stopId[0]} arrives in ${stopId[1]} minutes`;
            timeTableEl.appendChild(liElement);
        })
    } catch (error) {
        stopNameEl.textContent = 'Error';
    }
}