function attachEvents() {
    const submitBtn = document.getElementById('submit');
    submitBtn.addEventListener('click', getWeather);
}


async function getWeather(ev) {
    // deactivate button
    ev.target.value = "Loading...";
    ev.target.disabled = true;

    // get input field text
    const inputField = document.getElementById('location');
    const cityName = inputField.value;
    let code;

    const forecastDiv = document.getElementById("forecast");

    // error handling
    // empty input field
    // display error
    try {
        code = await getLocationCode(cityName);
    } catch (error) {
        inputField.value = '';
        forecastDiv.style.display = 'none';
        alert('Error');

        ev.target.disabled = false;
        ev.target.value = "Get Weather";
    }

    const [current, upcoming] = await Promise.all([
        getCurrent(code),
        getUpcoming(code)
    ]);

    // make visible div with id="forecast"
    forecastDiv.style.display = 'block';

    const currentDiv = document.getElementById("current");
    // currentDiv.style.display = 'block';
    const upcomingDiv = document.getElementById("upcoming");
    // upcomingDiv.style.display = 'block';

    const symbols = {
        "Sunny": "\u2600",
        "Partly sunny": "\u26C5",
        "Overcast": "\u2601",
        "Rain": "\u2614",
        // "Degrees": "&#176"
    }

    // remove old data of current weather
    // add data to current weather
    if (currentDiv) {
        currentDiv.innerHTML = '';
    }

    const currCondition = current.forecast.condition;
    const currSymbol = symbols[currCondition];

    currentDiv.appendChild(e('div', { className: "label" }, 'Current conditions'));
    const addToCurr = e('div', { className: "forecast" },
        e('span', { className: "condition symbol" }, currSymbol),
        e('span', { className: "condition" },
            e('span', { className: "forecast-data" }, current.name),
            e('span', { className: "forecast-data" }, `${current.forecast.low}°/${current.forecast.high}°`),
            e('span', { className: "forecast-data" }, current.forecast.condition),
        ));
    currentDiv.appendChild(addToCurr);


    // remove old data of upcoming weather
    // add data to upcoming weather
    if (upcomingDiv) {
        upcomingDiv.innerHTML = '';
    }

    upcomingDiv.appendChild(e('div', { className: "label" }, "Three-day forecast"));
    upcomingDiv.appendChild(e('div', { className: "forecast-info" },));
    const forecastInfo = upcomingDiv.querySelector('.forecast-info');
    for (let day of upcoming.forecast) {
        const addToUp = e('span', { className: "upcoming" },
            e('span', { className: "symbol" }, symbols[day.condition]),
            e('span', { className: "forecast-data" }, `${day.low}°/${day.high}°`),
            e('span', { className: "forecast-data" }, day.condition),
        )
        forecastInfo.appendChild(addToUp);
    }

    // activate button
    ev.target.disabled = false;
    ev.target.value = "Get Weather";
}

// get location code
async function getLocationCode(cityName) {
    const url = "http://localhost:3030/jsonstore/forecaster/locations";

    const res = await fetch(url);
    data = await res.json();

    const location = data.find(el => el.name.toLowerCase() === cityName.toLowerCase());
    return location.code;
}

// get current data
async function getCurrent(code) {
    const url = 'http://localhost:3030/jsonstore/forecaster/today/' + code;
    const res = await fetch(url);
    const data = await res.json();

    return data;
}

// get upcoming data
async function getUpcoming(code) {
    const url = 'http://localhost:3030/jsonstore/forecaster/upcoming/' + code;
    const res = await fetch(url);
    const data = await res.json();

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

attachEvents();