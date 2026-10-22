// ==========================================
// AEROCAST - WEATHER DASHBOARD
// ==========================================

// DOM ELEMENTS

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherContent =
    document.getElementById("weatherContent");

const welcome =
    document.getElementById("welcome");

const loading =
    document.getElementById("loading");

const errorBox =
    document.getElementById("error");

const cityName =
    document.getElementById("cityName");

const countryName =
    document.getElementById("countryName");

const temperature =
    document.getElementById("temperature");

const feelsLike =
    document.getElementById("feelsLike");

const weatherDescription =
    document.getElementById("weatherDescription");

const weatherIcon =
    document.getElementById("weatherIcon");

const humidity =
    document.getElementById("humidity");

const wind =
    document.getElementById("wind");

const pressure =
    document.getElementById("pressure");

const visibility =
    document.getElementById("visibility");

const forecast =
    document.getElementById("forecast");

const recentSearches =
    document.getElementById("recentSearches");

const unitToggle =
    document.getElementById("unitToggle");


// ==========================================
// SETTINGS
// ==========================================

let unit = "celsius";

let currentWeatherData = null;


// ==========================================
// WEATHER CODE INFORMATION
// ==========================================

function getWeatherInfo(code) {

    const weatherCodes = {

        0: {
            description: "Clear sky",
            icon: "☀️"
        },

        1: {
            description: "Mainly clear",
            icon: "🌤️"
        },

        2: {
            description: "Partly cloudy",
            icon: "⛅"
        },

        3: {
            description: "Overcast",
            icon: "☁️"
        },

        45: {
            description: "Fog",
            icon: "🌫️"
        },

        48: {
            description: "Fog",
            icon: "🌫️"
        },

        51: {
            description: "Light drizzle",
            icon: "🌦️"
        },

        53: {
            description: "Drizzle",
            icon: "🌦️"
        },

        55: {
            description: "Heavy drizzle",
            icon: "🌧️"
        },

        61: {
            description: "Light rain",
            icon: "🌦️"
        },

        63: {
            description: "Rain",
            icon: "🌧️"
        },

        65: {
            description: "Heavy rain",
            icon: "🌧️"
        },

        71: {
            description: "Light snow",
            icon: "🌨️"
        },

        73: {
            description: "Snow",
            icon: "❄️"
        },

        75: {
            description: "Heavy snow",
            icon: "❄️"
        },

        80: {
            description: "Rain showers",
            icon: "🌦️"
        },

        81: {
            description: "Rain showers",
            icon: "🌧️"
        },

        82: {
            description: "Heavy showers",
            icon: "⛈️"
        },

        95: {
            description: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            description: "Thunderstorm with hail",
            icon: "⛈️"
        },

        99: {
            description: "Heavy thunderstorm",
            icon: "⛈️"
        }

    };


    return weatherCodes[code] || {
        description: "Unknown",
        icon: "🌤️"
    };

}


// ==========================================
// SEARCH CITY
// ==========================================

async function searchCity() {

    const city =
        cityInput.value.trim();


    if (city === "") {

        showError(
            "Please enter a city name."
        );

        return;

    }


    showLoading();


    try {

        // Geocoding API

        const response =
            await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
            );


        if (!response.ok) {

            throw new Error(
                "Location search failed"
            );

        }


        const data =
            await response.json();


        if (
            !data.results ||
            data.results.length === 0
        ) {

            throw new Error(
                "City not found"
            );

        }


        const location =
            data.results[0];


        await getWeather(
            location
        );


        saveRecentSearch(
            location.name
        );


    }

    catch (error) {

        console.error(error);

        showError(
            "City not found. Please check the name."
        );

    }

}


// ==========================================
// GET WEATHER
// ==========================================

async function getWeather(location) {

    const latitude =
        location.latitude;

    const longitude =
        location.longitude;


    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Weather request failed"
        );

    }


    const data =
        await response.json();


    currentWeatherData = {
        location,
        data
    };


    displayWeather(
        location,
        data
    );

}


// ==========================================
// DISPLAY WEATHER
// ==========================================

function displayWeather(
    location,
    data
) {

    const current =
        data.current;


    const info =
        getWeatherInfo(
            current.weather_code
        );


    cityName.textContent =
        location.name;


    countryName.textContent =
        `${location.admin1 || ""} ${location.country || ""}`;


    updateTemperature(
        current.temperature_2m
    );


    updateFeelsLike(
        current.apparent_temperature
    );


    weatherDescription.textContent =
        info.description;


    weatherIcon.textContent =
        info.icon;


    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    wind.textContent =
        `${Math.round(current.wind_speed_10m)} km/h`;


    pressure.textContent =
        `${Math.round(current.surface_pressure)} hPa`;


    // Open-Meteo doesn't provide visibility
    // in this request.

    visibility.textContent =
        "-- km";


    displayForecast(
        data.daily
    );


    welcome.classList.add(
        "hidden"
    );


    errorBox.classList.add(
        "hidden"
    );


    weatherContent.classList.remove(
        "hidden"
    );

}


// ==========================================
// TEMPERATURE
// ==========================================

function updateTemperature(
    celsius
) {

    let value;


    if (unit === "celsius") {

        value = celsius;

    }

    else {

        value =
            (celsius * 9 / 5) + 32;

    }


    temperature.textContent =
        `${Math.round(value)}°`;

}


// ==========================================
// FEELS LIKE
// ==========================================

function updateFeelsLike(
    celsius
) {

    let value;


    if (unit === "celsius") {

        value = celsius;

    }

    else {

        value =
            (celsius * 9 / 5) + 32;

    }


    feelsLike.textContent =
        `${Math.round(value)}°`;

}


// ==========================================
// FORECAST
// ==========================================

function displayForecast(
    daily
) {

    forecast.innerHTML = "";


    daily.time.forEach(
        (date, index) => {

            const weather =
                getWeatherInfo(
                    daily.weather_code[index]
                );


            const day =
                new Date(date)
                    .toLocaleDateString(
                        "en-US",
                        {
                            weekday: "short"
                        }
                    );


            const maxC =
                daily.temperature_2m_max[index];


            const minC =
                daily.temperature_2m_min[index];


            const max =
                convertTemperature(
                    maxC
                );


            const min =
                convertTemperature(
                    minC
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "forecast-card";


            card.innerHTML = `

                <div class="forecast-day">
                    ${day}
                </div>

                <div class="forecast-icon">
                    ${weather.icon}
                </div>

                <div class="forecast-temp">
                    ${Math.round(max)}° /
                    ${Math.round(min)}°
                </div>

                <div class="forecast-condition">
                    ${weather.description}
                </div>

            `;


            forecast.appendChild(
                card
            );

        }
    );

}


// ==========================================
// TEMPERATURE CONVERSION
// ==========================================

function convertTemperature(
    celsius
) {

    if (unit === "celsius") {

        return celsius;

    }


    return (
        celsius * 9 / 5
    ) + 32;

}


// ==========================================
// °C / °F TOGGLE
// ==========================================

unitToggle.addEventListener(
    "click",
    () => {

        if (unit === "celsius") {

            unit = "fahrenheit";

            unitToggle.textContent =
                "°F";

        }

        else {

            unit = "celsius";

            unitToggle.textContent =
                "°C";

        }


        if (currentWeatherData) {

            displayWeather(
                currentWeatherData.location,
                currentWeatherData.data
            );

        }

    }
);


// ==========================================
// RECENT SEARCHES
// ==========================================

function saveRecentSearch(
    city
) {

    let searches =
        JSON.parse(
            localStorage.getItem(
                "aeroSearches"
            )
        ) || [];


    searches =
        searches.filter(
            item =>
                item.toLowerCase() !==
                city.toLowerCase()
        );


    searches.unshift(city);


    searches =
        searches.slice(0, 5);


    localStorage.setItem(
        "aeroSearches",
        JSON.stringify(searches)
    );


    displayRecentSearches();

}


// ==========================================
// DISPLAY RECENT SEARCHES
// ==========================================

function displayRecentSearches() {

    const searches =
        JSON.parse(
            localStorage.getItem(
                "aeroSearches"
            )
        ) || [];


    recentSearches.innerHTML = "";


    searches.forEach(
        city => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "recent-city";


            button.textContent =
                city;


            button.addEventListener(
                "click",
                () => {

                    cityInput.value =
                        city;

                    searchCity();

                }
            );


            recentSearches.appendChild(
                button
            );

        }
    );

}


// ==========================================
// LOADING
// ==========================================

function showLoading() {

    loading.classList.remove(
        "hidden"
    );


    weatherContent.classList.add(
        "hidden"
    );


    welcome.classList.add(
        "hidden"
    );


    errorBox.classList.add(
        "hidden"
    );

}


// ==========================================
// ERROR
// ==========================================

function showError(
    message
) {

    loading.classList.add(
        "hidden"
    );


    weatherContent.classList.add(
        "hidden"
    );


    welcome.classList.add(
        "hidden"
    );


    errorBox.classList.remove(
        "hidden"
    );


    const paragraph =
        errorBox.querySelector("p");


    paragraph.textContent =
        message;

}


// ==========================================
// SEARCH EVENTS
// ==========================================

searchBtn.addEventListener(
    "click",
    searchCity
);


cityInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            searchCity();

        }

    }
);


// ==========================================
// INITIALIZE
// ==========================================

displayRecentSearches();