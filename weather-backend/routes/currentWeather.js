// routes/currentWeather.js
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const currentWeatherSchema = require('../schemas/currentWeatherSchema');
const {currentWeather} = require('../controllers/weatherController');

const router = express.Router();

// router.use('/', graphqlHTTP({
//   schema: currentWeatherSchema,
//   graphiql: true,
// }));

router.route("/current/weather").get(currentWeather)

module.exports = router;
