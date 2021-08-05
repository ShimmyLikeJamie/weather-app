import 'babel-polyfill';
import { GOOGLE_KEY, OPENWEATHER_KEY } from './secret';

let theDate = new Date();
let currentDay = '';
let currentMonth = theDate.getMonth();
let currentDate = theDate.getDate();
let formattedAddress = '';

switch (theDate.getDay()) {
  case 0:
    currentDay = 'Sun';
    break;
  case 1:
    currentDay = 'Mon';
    break;
  case 2:
    currentDay = 'Tue';
    break;
  case 3:
    currentDay = 'Wed';
    break;
  case 4:
    currentDay = 'Thu';
    break;
  case 5:
    currentDay = 'Fri';
    break;
  case 6:
    currentDay = 'Sat';
    break;
}

switch (currentMonth) {
  case 0:
    currentMonth = 'Jan';
    break;
  case 1:
    currentMonth = 'Feb';
    break;
  case 2:
    currentMonth = 'Mar';
    break;
  case 3:
    currentMonth = 'Apr';
    break;
  case 4:
    currentMonth = 'May';
    break;
  case 5:
    currentMonth = 'Jun';
    break;
  case 6:
    currentMonth = 'Jul';
    break;
  case 7:
    currentMonth = 'Aug';
    break;
  case 8:
    currentMonth = 'Sep';
    break;
  case 9:
    currentMonth = 'Oct';
    break;
  case 10:
    currentMonth = 'Nov';
    break;
  case 11:
    currentMonth = 'Dec';
    break;
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

searchButton.onclick = async function () {
  let user_address = encodeURI('address=' + searchBar.value);
  let geocode_request = 'https://maps.googleapis.com/maps/api/geocode/json?';
  let full_geocode_request =
    geocode_request + user_address + '&key=' + GOOGLE_KEY;
  let data = await getLocation(full_geocode_request);
  console.log(data);

  todayDay.textContent =
    'Today: ' + currentDay + ' ' + currentMonth + ' ' + currentDate;
  todayCurrentTemp.textContent =
    'Current: ' + KtoF(data.current.temp).toFixed(2) + ' F';
  todayMaxTemp.textContent =
    'Max: ' + KtoF(data.daily[0].temp.max).toFixed(2) + ' F';
  todayMinTemp.textContent =
    'Min: ' + KtoF(data.daily[0].temp.min).toFixed(2) + ' F';
  todayCity.textContent = formattedAddress;
};
