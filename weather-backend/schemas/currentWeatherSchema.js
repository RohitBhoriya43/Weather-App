// schemas/currentWeatherSchema.js
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLFloat,GraphQLList } = require('graphql');
const axios = require('axios');
// const Weather = require('../models/Weather');

const HourlyWeatherType = new GraphQLObjectType({
    name: 'HourlyWeather',
    fields: () => ({ 
        date: { type: GraphQLString },
        temp: { type: GraphQLFloat },  
        icon: { type: GraphQLString },
    }),
  });

const WeatherType = new GraphQLObjectType({
  name: 'Weather',
  fields: () => ({
    location: { type: GraphQLString },
    temperature: { type: GraphQLFloat },
    description: { type: GraphQLString },
    icon: { type: GraphQLString },
    date: { type: GraphQLString },
    hourly: {type:new GraphQLList(HourlyWeatherType)},
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    hourlyWeather: {
      type: WeatherType,
      args: { location: { type: GraphQLString } },
      async resolve(parent, args) {
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${args.location}&appid=278d329c96f9aa1372677795a189fae1
&units=metric`);
            console.log("weather response",response.data)
          const { temp } = response.data.main;
          const {lon,lat} = response.data.coord
        //   console.log("weather hoursRes",hoursRes)
          console.log("lon,lat",lon,lat)
          console.log("weather response.data.weather[0]",JSON.stringify(response.data.weather[0]))
        //   const hoursRes = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lon=${lon}&lat=${lat}&exclude=current,minutely,hourly,daily,alerts&appid=8ff60935c354f2681fedfab07cec6aef`);
          let hoursRes = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?id=${response.data.id}&appid=8ff60935c354f2681fedfab07cec6aef&units=metric`);
        //   console.log("weather hoursRes",hoursRes.data)

            hoursRes = hoursRes.data
            let listObj = hoursRes.list
            let hourlyData = listObj.slice(0,4).map((d)=>{

                return {
                    date:d.dt_txt,
                    temp:d.main.temp,
                    icon:d.weather[0].icon
                }
              }
    
              )
            // let date = new Date(listObj.dt*1000);
            // let main = JSON.stringify(listObj.main)
            // let weather = JSON.stringify(listObj.weather)
            // let clouds = JSON.stringify(listObj.clouds)
            // let wind = JSON.stringify(listObj.wind)
            // let rain = JSON.stringify(listObj.rain)
            // let sys = JSON.stringify(listObj.sys)

            // console.log("let date = new Date(listObj.dt*1000)",date)
            // console.log("let weather = JSON.stringify(listObj.main)",main)
            // console.log("let weather = JSON.stringify(listObj.weather)",weather)
            // console.log("let clouds = JSON.stringify(listObj.clouds)",clouds)
            // console.log("let wind = JSON.stringify(listObj.wind)",wind)
            // console.log("let rain = JSON.stringify(listObj.rain)",rain)
            // console.log(" let sys = JSON.stringify(listObj.sys)",sys)




          const { description, icon } = response.data.weather[0];
          let weatherData = {
            location: args.location,
            temperature: temp,
            description,
            icon,
            date: new Date().toISOString(),
            hourly:hourlyData,
          };


          let index = Math.floor((24-new Date().getHours())/3)
          console.log("index: ", index)
        //   let listData =listObj.slice(0,index)
        //   console.log("listData",listData)


          

        //   console.log("hourlyData",hourlyData)
        //   weatherData["hourly"]=hourlyData

        //   let sunset = response.data.sys.sunset
        //   let date = new Date(sunset*1000);

        //   console.log("date ",date.getHours(),date.getMinutes())

          // Save to database
        //   const weather = new Weather(weatherData);
        //   await weather.save();

          return weatherData;
        } catch (error) {
            console.log("error  ",error.message)
          throw new Error('Error fetching current weather data');
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
