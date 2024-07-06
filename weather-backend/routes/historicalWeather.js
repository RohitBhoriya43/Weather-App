// routes/historicalWeather.js
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const historicalWeatherSchema = require('../schemas/historicalWeatherSchema');

const router = express.Router();

router.use('/', graphqlHTTP({
  schema: historicalWeatherSchema,
  graphiql: true,
}));

module.exports = router;
