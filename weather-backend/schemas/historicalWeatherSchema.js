// schemas/historicalWeatherSchema.js
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLFloat } = require('graphql');
// const Weather = require('../models/Weather');

const WeatherType = new GraphQLObjectType({
  name: 'Weather',
  fields: () => ({
    location: { type: GraphQLString },
    temperature: { type: GraphQLFloat },
    description: { type: GraphQLString },
    icon: { type: GraphQLString },
    date: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    historicalWeather: {
      type: new GraphQLList(WeatherType),
      args: {
        location: { type: GraphQLString },
        from: { type: GraphQLString },
        to: { type: GraphQLString },
      },
      async resolve(parent, args) {
        try {
          const { location, from, to } = args;
          const weatherData = await Weather.find({
            location,
            date: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          });

          return weatherData;
        } catch (error) {
          throw new Error('Error fetching historical weather data');
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
