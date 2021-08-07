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

let searchButton = document.getElementById('searchButton');
let searchBar = document.getElementById('searchBar');
let currentTemp = document.getElementById('currentTemp');
let todayDay = document.getElementById('todayDay');
let todayCurrentTemp = document.getElementById('todayCurrentTemp');
let todayMaxTemp = document.getElementById('todayMaxTemp');
let todayMinTemp = document.getElementById('todayMinTemp');
let todayCity = document.getElementById('todayCity');
let forecast = document.getElementById('forecast')

searchButton.onclick = async function () {
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
    'Current: ' + KtoF(data.current.temp).toFixed(2) + ' F';
  todayMaxTemp.textContent =
    'Max: ' + KtoF(data.daily[0].temp.max).toFixed(2) + ' F';
  todayMinTemp.textContent =
    'Min: ' + KtoF(data.daily[0].temp.min).toFixed(2) + ' F';
  todayCity.textContent = formattedAddress;

  for (let i = 0; i < future_dates.length; i++) {
    let forecastDay = document.createElement('span');
    forecastDay.classList.add('forecastDay');

    let day = document.createElement('h3');
    day.classList.add('day');
    day.textContent =
      getDay(future_dates[i]) +
      ' ' +
      getMonth(future_dates[i]) +
      ' ' +
      future_dates[i].getDate();

    let temp = document.createElement('p');
    temp.classList.add('temp');
    temp.textContent = KtoF(data.daily[i + 1].temp.day).toFixed(2) + ' F';

    let maxTemp = document.createElement('p');
    maxTemp.classList.add('maxTemp');
    maxTemp.textContent = KtoF(data.daily[i + 1].temp.max).toFixed(2) + ' F';

    let minTemp = document.createElement('p');
    minTemp.classList.add('minTemp');
    minTemp.textContent = KtoF(data.daily[i + 1].temp.min).toFixed(2) + ' F';

    let weatherIcon = document.createElement('img');
    weatherIcon.classList.add('weatherIcon');

    let weather = data.daily[i + 1].weather[0].main;

    if (weather == 'Clouds') {
      weatherIcon.setAttribute('src', 'styles/media/011-cloudy.svg');
    } else if (weather == 'Clear') {
      weatherIcon.setAttribute('src', 'styles/media/015-day.svg');
    } else if (weather == 'Rain') {
      weatherIcon.setAttribute('src', 'styles/media/003-rainy.svg');
    } else if (weather == 'Snow') {
      weatherIcon.setAttribute('src', 'styles/media/006-snowy.svg');
    } else {
      weatherIcon.setAttribute('src', 'styles/media/015-day.svg');
    }

    forecastDay.append(day);
    forecastDay.append(temp);
    forecastDay.append(maxTemp);
    forecastDay.append(minTemp);
    forecastDay.append(weatherIcon);
    forecast.append(forecastDay);
  }
};
