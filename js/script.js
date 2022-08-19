// define as variáveis para manipular o DOM
const dayWeek = document.querySelector('[data-day-week]')
const city = document.querySelector('[data-city]')
const region = document.querySelector('[data-region]');
const icon = document.querySelector('[data-icon]');
const weather_description = document.querySelector('[data-description]');
const temperature = document.querySelector('[data-temp]');
const wind_speed = document.querySelector('[data-wind]');
const feelslike = document.querySelector('[data-feelslike]');
const humidity = document.querySelector('[data-humidity]');
const search_input = document.querySelector('.form-control');
const search_button = document.querySelector('[data-bt-pesquisa]');
const hist_button = document.querySelector('[data-bt-historico');
const inputEle = document.getElementById('enter');
const tbody = document.querySelector('[data-table]');

let ehPesquisa;
//chamada funções de botão 
search_button.addEventListener('click', () => { searchByInput(search_input.value) });

search_input.addEventListener('keyup', function (e) {
    var key = e.key;
    if (key == 'Enter') {
        searchByInput(search_input.value);
    }
});
//verifica se o navegador possui geolocation e busca os dados no servidor da previsão do tempo para as coordenadas extraidas
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

async function searchByInput(city) {
    const res = await fetch(`/searchCity/${city}`)
    const jsonResponse = await res.json();
    displayResults(jsonResponse);
    const date = new Date();
    //inserindo dados no banco
    const weather = {
        searchedCity: city,
        icon: `https://openweathermap.org/img/wn/${jsonResponse.weather[0].icon}@2x.png`,
        weatherDescription: jsonResponse.weather[0].description,
        temp: Math.round(jsonResponse.main.temp),
        measureUnit: 'c',
        windSpeed: Math.round(jsonResponse.wind.speed),
        time: date,
        humidity: jsonResponse.main.humidity
    }
    const options = {
        method: 'POST',
        body: JSON.stringify(weather),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Accept': 'application/json'
        }
    }
    await fetch(`/db/`, options)
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
}

//monta os dias da semana 
function dateBuilder(d) {
    let days = ["domingo", "segunda", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
    let day = days[d.getDay()]; //getDay: 0-6
    return `${day}`;
}

hist_button.addEventListener('click', async () => {
    const res = await fetch('/list');
    const jsonRes = await res.json();
    criaLista(jsonRes);
});

async function criaLista(arrayWeather) {
    arrayWeather.forEach(async (element) => {
        const tr = tbody.insertRow();
        const td_id = await tr.insertCell();
        const td_city = await tr.insertCell();
        const td_icon = await tr.insertCell();
        const td_description = await tr.insertCell();
        const td_temp = await tr.insertCell();
        const td_windSpeed = await tr.insertCell();
        const td_humidity = await tr.insertCell();
        const td_time = await tr.insertCell();

        td_id.innerHTML += 1
        td_city.innerHTML = element.searchedCity.toUpperCase()
        td_icon.innerHTML = `<img src=\'${element.icon}\' width=\'40px\'>`
        td_description.innerHTML = element.weatherDescription
        td_temp.innerHTML = element.temp
        td_windSpeed.innerHTML = `${element.windSpeed}km/h`
        td_humidity.innerHTML = `${element.humidity}%`
        td_time.innerHTML = element.time
    });
}
