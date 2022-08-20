// VARIAVEIS CURRENT WEATHER
const dayWeek = document.querySelector('[data-day-week]');
const city = document.querySelector('[data-city]');
const region = document.querySelector('[data-region]');
const icon = document.querySelector('[data-icon]');
const weather_description = document.querySelector('[data-description]');
const temperature = document.querySelector('[data-temp]');
const wind_speed = document.querySelector('[data-wind]');
const feelslike = document.querySelector('[data-feelslike]');
const humidity = document.querySelector('[data-humidity]');
const tbody = document.querySelector('[data-table]');
const feelsLike = document.querySelector('[data-feels-like]');

//VARIAVEIS WEEK WEATHER


//verifica se o navegador possui geolocation e busca os dados no servidor da previsão do tempo para as coordenadas extraidas
async function getWeatherByLoc() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async position => {
            let lat, lon;
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            const res = await fetch(`/latlon/${lat},${lon}`); //response recebe uma promisse do fetch com a rota definida no index.js
            const jsonResponse = await res.json();
            displayResults(jsonResponse);
        });
    } else {
        alert("Desculpe mas seu navegador não possui Geolocalização")
    }
}

async function searchByInput() {
    const cidade = document.querySelector('input').value
    const res = await fetch(`/searchCity/${cidade}`)
    const jsonResponse = await res.json();
    document.querySelector('input').value = ""
    displayResults(jsonResponse);
}

function displayResults(dataWeather) {
    city.innerText = `${dataWeather.name}`;
    let now = new Date();
    dayWeek.innerText = dateBuilder(now);
    icon.src = `https://openweathermap.org/img/wn/${dataWeather.weather[0].icon}@2x.png`;
    temperature.innerHTML = Math.round(dataWeather.main.temp);
    weather_description.innerHTML = dataWeather.weather[0].description;
    wind_speed.innerHTML = Math.round(dataWeather.wind.speed);
    humidity.innerHTML = dataWeather.main.humidity;
    feelsLike.innerHTML = Math.round(dataWeather.main.feels_like);

}

//monta os dias da semana 
function dateBuilder(d) {
    let days = ["domingo", "segunda", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
    let day = days[d.getDay()]; //getDay: 0-6
    return `${day}`;
}

