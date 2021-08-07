import 'babel-polyfill';
import { GOOGLE_KEY, OPENWEATHER_KEY } from './secret';

let theDate = new Date();
let formattedAddress = '';
let future_dates = [];

for (let i = 0; i < 6; i++) {
  //Create dates for next six days
  let future_date = new Date();
  future_date.setDate(new Date().getDate() + (i + 1));
  future_dates.push(future_date);
}

function getDay(date) {
  switch (date.getDay()) {
    case 0:
      return 'Sun';
    case 1:
      return 'Mon';
    case 2:
      return 'Tue';
    case 3:
      return 'Wed';
    case 4:
      return 'Thu';
    case 5:
      return 'Fri';
    case 6:
      return 'Sat';
  }
}

function getMonth(date) {
  switch (date.getMonth()) {
    case 0:
      return 'Jan';
    case 1:
      return 'Feb';
    case 2:
      return 'Mar';
    case 3:
      return 'Apr';
    case 4:
      return 'May';
    case 5:
      return 'Jun';
    case 6:
      return 'Jul';
    case 7:
      return 'Aug';
    case 8:
      return 'Sep';
    case 9:
      return 'Oct';
    case 10:
      return 'Nov';
    case 11:
      return 'Dec';
  }
}

function KtoF(temp) {
  let fahrenheit = ((temp - 273.15) * 9) / 5 + 32;
  return fahrenheit;
}

function FtoC(temp) {
  let celsius = ((temp - 32) * 5) / 9;
  return celsius;
}

function CtoF(temp) {
  let fahrenheit = (temp * 9) / 5 + 32;
  return fahrenheit;
}

async function getLocation(request) {
  //Formats user search using Geolocation API
  try {
    const response = await fetch(request, { method: 'POST', mode: 'cors' });
    let data = await response.json();
    console.log(data);
    let lat = data.results[0].geometry.location.lat;
    let lng = data.results[0].geometry.location.lng;
    formattedAddress = data.results[0].formatted_address;

    let weather_request = 'https://api.openweathermap.org/data/2.5/onecall?';
    let weather_uri = encodeURI(
      `lat=${lat}&lon=${lng}&appid=` + OPENWEATHER_KEY
    );
    let full_weather_request = weather_request + weather_uri;

    return await getWeather(full_weather_request);
  } catch (error) {
    console.log('Error!');
    console.log(error);
  }
}

function selectWeatherIcon(weather) {
  if (weather == 'Clouds') {
    return 'styles/media/011-cloudy.svg';
  } else if (weather == 'Clear') {
    return 'styles/media/015-day.svg';
  } else if (weather == 'Rain') {
    return 'styles/media/003-rainy.svg';
  } else if (weather == 'Snow') {
    return 'styles/media/006-snowy.svg';
  } else {
    return 'styles/media/015-day.svg';
  }
}

async function getWeather(request) {
  //Gets weather data for location
  try {
    const response = await fetch(request, { method: 'POST', mode: 'cors' });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error!');
    console.log(error);
  }
}

function prettyDate2(time) {
  var date = new Date(parseInt(time));
  return date.toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

let searchButton = document.getElementById('searchButton');
let searchBar = document.getElementById('searchBar');
let currentTemp = document.getElementById('currentTemp');
let todayDay = document.getElementById('todayDay');
let todayCurrentTemp = document.getElementById('todayCurrentTemp');
let todayMaxTemp = document.getElementById('todayMaxTemp');
let todayMinTemp = document.getElementById('todayMinTemp');
let todayCity = document.getElementById('todayCity');
let forecast = document.getElementById('forecast');
let todayWeatherIcon = document.getElementById('todayWeatherIcon');
let sunriseData = document.getElementById('sunriseData');
let sunsetData = document.getElementById('sunsetData');
let chanceOfRainData = document.getElementById('chanceOfRainData');
let humidityData = document.getElementById('humidityData');
let windData = document.getElementById('windData');
let feelsLikeData = document.getElementById('feelsLikeData');
let precipitationData = document.getElementById('precipitationData');
let pressureData = document.getElementById('pressureData');
let visibilityData = document.getElementById('visibilityData');
let uvIndexData = document.getElementById('uvIndexData');

searchButton.onclick = async function () {
  // Gets weather data and updates page with it
  let user_address = encodeURI('address=' + searchBar.value);
  let geocode_request = 'https://maps.googleapis.com/maps/api/geocode/json?';
  let full_geocode_request =
    geocode_request + user_address + '&key=' + GOOGLE_KEY;
  let data = await getLocation(full_geocode_request);
  console.log(data);

  todayDay.textContent =
    'Today: ' +
    getDay(theDate) +
    ' ' +
    getMonth(theDate) +
    ' ' +
    theDate.getDate();

  todayCurrentTemp.textContent =
    'Now: ' + KtoF(data.current.temp).toFixed(0) + '°F';
  todayMaxTemp.textContent =
    'H: ' + KtoF(data.daily[0].temp.max).toFixed(0) + '°F';
  todayMinTemp.textContent =
    'L: ' + KtoF(data.daily[0].temp.min).toFixed(0) + '°F';
  todayCity.textContent = formattedAddress;

  todayWeatherIcon.setAttribute(
    'src',
    selectWeatherIcon(data.daily[0].weather[0].main)
  );

  let sunriseTime = new Date(data.current.sunrise * 1000);
  sunriseData.textContent =
    sunriseTime.getHours() + ':' + sunriseTime.getMinutes();

  let sunsetTime = new Date(data.current.sunset * 1000);
  sunsetData.textContent =
    sunsetTime.getHours() + ':' + sunsetTime.getMinutes();

  for (let i = 0; i < future_dates.length; i++) {
    // Iterate through next 6 days and display forecast
    let forecastDay = document.createElement('span');
    forecastDay.classList.add('forecastDay');

    let day = document.createElement('p');
    day.classList.add('day');
    day.textContent =
      getDay(future_dates[i]) +
      ' ' +
      getMonth(future_dates[i]) +
      ' ' +
      future_dates[i].getDate();

    let maxTemp = document.createElement('p');
    maxTemp.classList.add('maxTemp');
    maxTemp.textContent =
      'H: ' + KtoF(data.daily[i + 1].temp.max).toFixed(0) + '°F';

    let minTemp = document.createElement('p');
    minTemp.classList.add('minTemp');
    minTemp.textContent =
      'L: ' + KtoF(data.daily[i + 1].temp.min).toFixed() + '°F';

    let weatherIcon = document.createElement('img');
    weatherIcon.classList.add('weatherIcon');

    let weather = data.daily[i + 1].weather[0].main;
    weatherIcon.setAttribute('src', selectWeatherIcon(weather));

    let humidity = document.createElement('p');
    humidity.classList.add('humidity');
    humidity.textContent = data.daily[i + 1].humidity + '%';

    forecastDay.append(day);
    forecastDay.append(maxTemp);
    forecastDay.append(minTemp);
    forecastDay.append(weatherIcon);
    forecastDay.append(humidity);
    forecast.append(forecastDay);
  }
};
