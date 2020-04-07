'use strict';
// Define, Do, Go
// Dependecies (dotenv, express, cors)
// 1. b/c they all depends on it
// read .env file
require('dotenv').config();

// express app
const express = require('express');

// cros origin resource sharing
const cors = require('cors');

// initilize app
const app = express();
app.use(cors()); //give access

const PORT = process.env.PORT || 3000; //3000

// home rout
app.get('/', (request, response) => {
  // 200 ok
  response.status(200).send('your app is working whoo');
});

// get the location
// app.get('/location', (request, response) => {
//   const locationData = require('./data/geo.json');
//   let location = new Location('lynwood', locationData);
//   response.status(200).json(location);
// });

// get the location in much cooler way
app.get('/location', locationHandler);
// app.get("/weather", weatherHandler);

function locationHandler(request, response) {
  // Query string ?a=b&c=d
  // http://localhost:3000/location?city=amman&name=bebo
  // console.log(request.query); //will be shown as an object on the terminal (from the link above)
  let cityName = request.query.cityName;
  let locationsData = getLocation(cityName);
  response.status(200).json(locationsData);
}

function getLocation(cityName) {
  const locationData = require('./data/geo.json');
  return new Location(cityName, locationData);
}
// -------------------------------------------------------------
// Weather data
// -------------------------------------------------------------
// function weatherHandler(request, response) {
//   let cityName = request.query.cityName;
//   let weathersData = getWeather(cityName);
//   response.status(200).json(weathersData);
// }

// function getWeather() {
//   const weatherData = require('./data/weather.json');
//   // console.log(weatherData.daily.data);
//   return weatherData.data.map((day) => {
//     // map return something to become new array
//     return new Weather(day);
//   });
// }

app.get('/weather', (req, res) => {
  let yasmeen = [];
  const weatherData = require('./data/weather.json');
  // console.log(weatherData);
  weatherData.data.map((day) => {
    let baraah = new Weather(day);
    yasmeen.push(baraah);
  });
  res.status(200).json(yasmeen);
});

// error rout
app.get('/boo', (request, response) => {
  throw new Error('oops its not working');
});
// not found rout
app.use('*', (request, response) => {
  // 404 not found
  response.status(400).send('SORRY, not foud 404');
});

// when error happend run this
app.use((error, request, response) => {
  // 500 error
  response.status(500).send(error);
});

// get the location
// make a constructor function
function Location(cityName, locationData) {
  this.search_query = cityName;
  this.formatted_query = locationData[0].display_name;
  this.latitude = locationData[0].lat;
  this.longitude = locationData[0].lon;
}

// make a constructor function
function Weather(day) {
  this.description = day.weather.description;
  this.valid_date = new Date(day.valid_date).toString().slice(0, 15);
}

// make the app listenning
app.listen(PORT, () => console.log(`app is listenning to PORT ${PORT}`));

// heroku run the app (netlyfy its a service that only static files it cannot run a app)
// javascript convert epoch to date (epoch is the time in mellisecond)