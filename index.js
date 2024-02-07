const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');
const userContainer =document.querySelector('.weather-container');

const grantAccessContainer = document.querySelector('.grant-location-container');
const searchForm = document.querySelector('[data-searchForm]');
const searchInput = document.querySelector('[data-searchInp]');
const loadingContainer = document.querySelector('.loading-container');
const userInfoContainer = document.querySelector('.userInfo-container');

// initially needed variable

let currentTab = userTab;
const API_KEY = "2ae23a5f49f132f966b9105a65795cfe";
currentTab.classList.add('currentTab');
getFromSessionStorage();

console.log("Running");

function switchTab(newTAb) {
    if(newTAb != currentTab)
    {
        currentTab.classList.remove("currentTab")
        currentTab = newTAb;
        currentTab.classList.add("currentTab"); 
        
        if(! searchForm.classList.contains("active"))
        {
            grantAccessContainer.classList.remove('active');
            userInfoContainer.classList.remove('active');
            searchForm.classList.add('active');
        }
        else {

            // at first we were in search tab , now we have to display the user tab

            searchForm.classList.remove('active');
            userInfoContainer.classList.add('active');

            // we are now on your weather tab, we have to display the weather so lets check local weather first
            // for co-ordinates, we have saved them there

            getFromSessionStorage();
        }
    }
    
}

userTab.addEventListener("click" , ()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click" , ()=>{
    switchTab(searchTab);
});

// checks if coordinates are allready present in session storage

function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        grantAccessContainer.classList.add('active');
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);

    }
}


async function fetchUserWeatherInfo(coordinates) {

    const {lat , lon} = coordinates;

    // make grant access container invisible
    grantAccessContainer.classList.remove('active');

    // make loader visible
    loadingContainer.classList.add('active');

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
            );
        
        const data = await response.json();
        
        loadingContainer.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherINfo(data);
    }

    catch(err) {

    }
}

function renderWeatherINfo(weatherInfo) {

    // firstly we have to fetch the elements

    const cityName = document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector('[data-contryIcon]');
    const weatherDescription = document.querySelector('[data-weatherDescription]');
    const weatherIcon = document.querySelector('[data-weatherIcon]');
    const temp = document.querySelector('[data-temp]');
    const windSpeed = document.querySelector('[data-windSpeed]');
    const humidity = document.querySelector('[data-humidity]');
    const cloudiness = document.querySelector('[data-cloudiness]');

    // fetch values from weatherInfo object and put in UI elements 

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/16x12/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDescription.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerHTML = weatherInfo?.main?.temp + " k";
    windSpeed.innerHTML = weatherInfo?.wind?.speed  + "m/s";
    humidity.innerHTML = weatherInfo?.main?.humidity + "%";
    cloudiness.innerHTML = weatherInfo?.clouds?.all + "%";
    
}

function getLocation() {
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    else {
        // HW -Show an allert for no geolacationsupport available

    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton = document.querySelector('[data-grantAccess]');
grantAccessButton.addEventListener("click", getLocation);

const searchInputBtn = document.querySelector("[data-searchInpBtn]");

searchInputBtn.addEventListener("click" , (e) => {
    console.log("clicked");
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
    {
        return;
    }
    else {
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city) {
    loadingContainer.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
            );

            const data = await response.json();
        
            loadingContainer.classList.remove('active');
            userInfoContainer.classList.add('active');
            renderWeatherINfo(data);
    }

    catch(err) {

    }
}