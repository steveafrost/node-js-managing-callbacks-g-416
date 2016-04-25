const prompt  = require('prompt');
const request = require('request');
const async   = require('async');

const WEATHER_API_URL = 'http://api.openweathermap.org/data/2.5/weather?q='
const WEATHER_API_KEY = '88bfde3533d98e8a300a138ef668cda2';

