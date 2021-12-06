function solve() {
    const info = document.querySelector("#info");
    const departBtn = document.getElementById('depart');
    const arriveBtn = document.getElementById('arrive');

    let stop = {
        next: 'depot'
    }

    async function depart() {
        // activate other button
        // get information about next stop
        // display name of next stop
        departBtn.disabled = true;
        const url = `http://localhost:3030/jsonstore/bus/schedule/${stop.next}`;

        const res = await fetch(url);
        stop = await res.json();

        info.textContent = `Next stop ${stop.name}`;

        arriveBtn.disabled = false;
    }

    function arrive() {
        // display name of current stop
        // activate other button
        info.textContent = `Arriving at ${stop.name}`;

        departBtn.disabled = false;
        arriveBtn.disabled = true;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();