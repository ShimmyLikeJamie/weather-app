import 'babel-polyfill';
import { GOOGLE_KEY, OPENWEATHER_KEY } from './secret';

let theDate = new Date();
let formattedAddress = '';
let future_dates = [];
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
let pressureData = document.getElementById('pressureData');
let visibilityData = document.getElementById('visibilityData');
let uvIndexData = document.getElementById('uvIndexData');
let units = '';

if (currentTemp.textContent.includes('F')) {
  units = 'imperial';
} else {
  units = 'metric';
}

function degToCompass(num) {
  // Taken from stack overflow and modified for JS
  // https://stackoverflow.com/questions/7490660/converting-wind-direction-in-angles-to-text-words
  let val = parseInt(num / 22.5 + 0.5);
  let arr = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];
  return arr[val % 16];
}

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
      `lat=${lat}&lon=${lng}&units=${units}&appid=` + OPENWEATHER_KEY
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

function prettyMinutes(minutes) {
  if (parseInt(minutes) < 10) {
    return '0' + minutes;
  } else {
    return minutes;
  }
}

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

  todayCity.textContent = formattedAddress;

  if (units == 'imperial') {
    todayCurrentTemp.textContent =
      'Now: ' + data.current.temp.toFixed(1) + '°F';
    todayMaxTemp.textContent = 'H: ' + data.daily[0].temp.max.toFixed(1) + '°F';
    todayMinTemp.textContent = 'L: ' + data.daily[0].temp.min.toFixed(1) + '°F';
  } else {
    todayCurrentTemp.textContent =
      'Now: ' + data.current.temp.toFixed(1) + '°C';
    todayMaxTemp.textContent = 'H: ' + data.daily[0].temp.max.toFixed(1) + '°C';
    todayMinTemp.textContent = 'L: ' + data.daily[0].temp.min.toFixed(1) + '°C';
  }

  todayWeatherIcon.setAttribute(
    'src',
    selectWeatherIcon(data.daily[0].weather[0].main)
  );

  let sunriseTime = new Date(data.current.sunrise * 1000);

  sunriseData.textContent =
    sunriseTime.getHours() + ':' + prettyMinutes(sunriseTime.getMinutes());

  let sunsetTime = new Date(data.current.sunset * 1000);
  sunsetData.textContent =
    sunsetTime.getHours() + ':' + prettyMinutes(sunsetTime.getMinutes());

  chanceOfRainData.textContent = data.daily[0].pop;
  humidityData.textContent = data.current.humidity + '%';
  if (units == 'imperial') {
    windData.textContent =
    degToCompass(data.current.wind_deg) +
    ' ' +
    data.current.wind_speed +
    ' mi/hr';
  } else {
    windData.textContent =
    degToCompass(data.current.wind_deg) +
    ' ' +
    data.current.wind_speed +
    ' km/hr';
  }
  feelsLikeData.textContent = data.current.feels_like.toFixed(0) + '°F';

  pressureData.textContent = data.current.pressure + ' hPa';

  let visibility = '';
  if ((data.current.visibility >= 1000) && (units == 'metric')) {
    visibility = (data.current.visibility / 1000).toFixed(1) + ' km';
  } else if (units == 'imperial') {
    visibility = (data.current.visibility / 5280).toFixed(1) + ' mi';
  } else {
    visibility = data.current.visibility + ' m';
  }
  visibilityData.textContent = visibility;

  uvIndexData.textContent = data.current.uvi;

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
    maxTemp.classList.add('temp');

    let minTemp = document.createElement('p');
    minTemp.classList.add('minTemp');
    minTemp.classList.add('temp');

    if (units == 'imperial') {
      maxTemp.textContent =
        'H: ' + data.daily[i + 1].temp.max.toFixed(1) + '°F';
      minTemp.textContent =
        'L: ' + data.daily[i + 1].temp.min.toFixed(1) + '°F';
    } else {
      maxTemp.textContent =
        'H: ' + data.daily[i + 1].temp.max.toFixed(1) + '°C';
      minTemp.textContent =
        'L: ' + data.daily[i + 1].temp.min.toFixed(1) + '°C';
    }

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
