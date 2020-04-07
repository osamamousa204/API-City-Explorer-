'use strict';
// read .env file
require('dotenv').config();
// Application Dependencies
// express server
const express = require('express');
// resource sharing
const cors = require('cors');
const superagent = require('superagent');

// Application setup
const PORT = process.env.PORT;
// initilize the server
const app = express();
app.use(cors());

// ============================================================
// ==========================LOCATION==========================
// ============================================================
app.get('/location', locationHandler);

function locationHandler(req, res) {
  let city = req.query.city;
  getLocation(city).then((locationInfo) => {
    res.status(200).json(locationInfo);
  });
}
let locationArray = [];
function getLocation(city) {
  const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.YOUR_PRIVATE_TOKEN}&q=${city}&format=json`;
  return superagent.get(url).then((locationData) => {
    let returnedConstructors = new Location(city, locationData.body);
    locationArray.push(returnedConstructors);
    // console.log('lng----------------------------', locationArray[0].longitude);
    // console.log('arra', yasmeen);
    return returnedConstructors;
  });
}

// ============================================================
// ==========================WEATHER===========================
// ============================================================
app.get('/weather', weatherHandler);
// function weatherHandler(req, res) {
//   let city = req.query.search_query;
//   // const url = `https://api.weatherbit.io/v2.0/current?city=${city}&key=${process.env.WEATHERBIT_API_KEY}`;
//   const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${process.env.WEATHERBIT_API_KEY}`;

//   superagent.get(url).then((wData) => {
//     // console.log(wData);
//     res.status(200).json(wData.body.data.map((day) => new Weather(day)));
//   });
// }

function weatherHandler(req, res) {
  let city = req.query.search_query;
  getWeather(city).then((weatherData) => res.status(200).json(weatherData));
}

function getWeather(city) {
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${process.env.WEATHERBIT_API_KEY}`;
  return superagent.get(url).then((WData) => {
    // let bebo = WData.body;
    return WData.body.data.map((val) => {
      return new Weather(val);
    });
  });
}

// ============================================================
// ==========================Trail=============================
// ============================================================
app.get('/trails', trailHandler);
function trailHandler(req, res) {
  const url = `https://www.hikingproject.com/data/get-trails?lat=${locationArray[0].latitude}&lon=${locationArray[0].longitude}&maxResults=10&key=${process.env.TRAIL_API_KEY}`;
  superagent.get(url).then((result) => {
    const trails = result.body.trails.map((trailData) => {
      return new Trail(trailData);
    });
    res.send(trails);
  });
}
// ==============constructor functions============================
// =======Location constructor function===========================
function Location(city, locationData) {
  this.city = city;
  this.formatted_query = locationData[0].display_name;
  this.latitude = locationData[0].lat;
  this.longitude = locationData[0].lon;
}

// =======Weather constructor function===========================
function Weather(day) {
  this.forecast = day.weather.description;
  this.valid_date = new Date(day.valid_date).toString().slice(0, 15);
}

// =======Trail constructor function===========================
function Trail(trail) {
  this.name = trail.name;
  this.location = trail.location;
  this.length = trail.length;
  this.stars = trail.stars;
  this.star_votes = trail.starVotes;
  this.summary = trail.summary;
  this.trail_url = trail.url;
  // this.conditions = trail.conditionDetails; // not working !!
  this.condition_date = trail.conditionDate.slice(0, 10);
  this.condition_time = trail.conditionDate.slice(11);
}
// // =======================================================================
// =======================================================================
// ===============ok rout=================================================
app.get('/', (req, res) => {
  res.status(200).send('your app is working perfectly fine');
});
// ====================throw error=======================
app.get('/boo', (req, res) => {
  throw new Error('heheheheeee, ERROR');
});
// =================not found rout========================
app.use('*', (req, res) => {
  res.status(404).send('Oops, 404 not found');
});
// ========trigger the error msg=======================
app.use((error, req, res) => {
  res.status(500).send(error);
});
// ====================app listening====================
app.listen(PORT, () => {
  console.log('Hello, I am your lab and I am working');
});

// EVENTBRITE_API_KEY=200720611-853a866402040d9f6b26687320787105
