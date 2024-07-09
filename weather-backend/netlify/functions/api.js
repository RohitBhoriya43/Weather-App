// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv")
const serverless = require("serverless-http")
const db = require("../../configs/db")

const currentWeatherRoute = require("../../routes/currentWeather");
// const WeatherRoute = require('./routes/currentWeather');
// const historicalWeatherRoute = require('./routes/historicalWeather');

const app = express();
dotenv.config()
// console.log("process.env.OPENWEATHERAPIKEY",process.env.OPENWEATHERAPIKEY)
db()

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
// mongoose.connect('your_mongodb_connection_string', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Routes
// app.use('/graphql/current', currentWeatherRoute);
app.use('/api/v1', currentWeatherRoute);
// app.use('/graphql/historical', historicalWeatherRoute);

const handler = serverless(app)

module.exports = {app,handler}
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
