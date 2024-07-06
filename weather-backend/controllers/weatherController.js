const axios = require('axios');


const currentWeather =async(req,res) =>{
    try {
        let {location} = req.query
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHERAPIKEY}&units=metric`);
          console.log("weather response",response.data)
        const { temp,feels_like } = response.data.main;
        const {lon,lat} = response.data.coord
      //   console.log("weather hoursRes",hoursRes)
        console.log("lon,lat",lon,lat)
        console.log("weather response.data.weather[0]",JSON.stringify(response.data.weather[0]))
        const hoursRes = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lon=${lon}&lat=${lat}&appid=${process.env.OPENWEATHERAPIKEY}&units=metric`);
        // let hoursRes = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?id=${response.data.id}&appid=8ff60935c354f2681fedfab07cec6aef&units=metric`);
        // console.log("weather hoursRes",hoursRes.data)

        //   hoursRes = hoursRes.data
        //   let listObj = hoursRes.list
        //   let index = Math.floor((24-new Date().getHours())/3)
        //     console.log("index: ", index)
        console.log("listData date",new Date(),new Date(hoursRes.data.hourly[5].dt*1000).toISOString())
          let {dt} = hoursRes.data.current
          let filterDate= convertFilterDate(dt)
          let hourlyData = hoursRes.data.hourly.map((d)=>{

              return {
                  hourTime:convertTime(new Date(d.dt*1000).toISOString()),
                  date:new Date(d.dt*1000).toISOString(),
                  temp:d.temp,
                  icon:d.weather[0].icon
              }
            })
            .filter((d)=>filterDate<=d.date)
        //   // let date = new Date(listObj.dt*1000);
        //   // let main = JSON.stringify(listObj.main)
        //   // let weather = JSON.stringify(listObj.weather)
        //   // let clouds = JSON.stringify(listObj.clouds)
        //   // let wind = JSON.stringify(listObj.wind)
        //   // let rain = JSON.stringify(listObj.rain)
        //   // let sys = JSON.stringify(listObj.sys)

        //   // console.log("let date = new Date(listObj.dt*1000)",date)
        //   // console.log("let weather = JSON.stringify(listObj.main)",main)
        //   // console.log("let weather = JSON.stringify(listObj.weather)",weather)
        //   // console.log("let clouds = JSON.stringify(listObj.clouds)",clouds)
        //   // console.log("let wind = JSON.stringify(listObj.wind)",wind)
        //   // console.log("let rain = JSON.stringify(listObj.rain)",rain)
        //   // console.log(" let sys = JSON.stringify(listObj.sys)",sys)




        const { description, icon } = response.data.weather[0];
        let weatherData = {
          location: location,
          temperature: temp,
          description,
          icon,
          feels_like,
          sunset:convertHoursAndMinute(response.data.sys.sunset),
          date: convertFullDate(response.data.dt),
          hourly:hourlyData.slice(0,10),
          // hourly:hoursRes.data,
        };


        
      //   let listData =listObj.slice(0,index)


        

      //   console.log("hourlyData",hourlyData)
      //   weatherData["hourly"]=hourlyData

      //   let sunset = response.data.sys.sunset
      //   let date = new Date(sunset*1000);

      //   console.log("date ",date.getHours(),date.getMinutes())

        // Save to database
      //   const weather = new Weather(weatherData);
      //   await weather.save();

        return res.status(200).json(weatherData);
      } catch (error) {
          console.log("error  ",error.message)
        // throw new Error('Error fetching current weather data');
        res.status(400).json({
            error:error.message
        })
      }
}


const convertTime=(date) =>{
  // console.log("converted date: ",date)
    let hour = date.split("T")[1].split(":")[0] 
    if (Number(hour) > 12){
        return `${Number(hour) - 12} PM`
    }else if(Number(hour)===0){
        return `12 AM`
    }else{
        return `${Number(hour)} AM`
    }
}

const convertFullDate = (dt) => {
    let monthArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    let date = new Date(dt*1000)
    return `${date.getDay()} ${monthArray[date.getMonth()]} ${date.getFullYear()}`

}

const convertHoursAndMinute = (time)=>{
  let date = new Date(time*1000)
  let hours = date.getHours()
  let minutes = date.getMinutes()
  return `${hours}:${minutes}`
 
}

const convertFilterDate=(dt)=>{
  console.log("dt: ",dt)
  let date = new Date(dt*1000)
  console.log("date: ",date)
  console.log("date get hours: ",date.getHours())
  // let hoursData = date.toISOString().split("T")[1].split(":")[0]
  let filterDate = `${date.getFullYear()}-${date.getMonth()+1>=10?date.getMonth()+1:'0'+(date.getMonth()+1)}-${date.getDate()>=10?date.getDate():'0'+date.getDate()}T${date.getHours()}:00:00.000Z`
  console.log("filterDate",filterDate)
  return filterDate
}



module.exports = {currentWeather}