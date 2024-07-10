const axios = require('axios');


const currentWeather =async(req,res) =>{
    try {
        let {location} = req.query
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHERAPIKEY}&units=metric`);
          // console.log("weather response",response.data)
        // const { temp,feels_like } = response.data.main;
        const {lon,lat} = response.data.coord
      //   console.log("weather hoursRes",hoursRes)
        // console.log("lon,lat",lon,lat)
        // console.log("weather response.data.weather[0]",JSON.stringify(response.data.weather[0]))
        const hoursRes = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lon=${lon}&lat=${lat}&appid=${process.env.OPENWEATHERAPIKEY}&units=metric`);
        // let hoursRes = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?id=${response.data.id}&appid=8ff60935c354f2681fedfab07cec6aef&units=metric`);
        // console.log("weather hoursRes",hoursRes.data)

        //   hoursRes = hoursRes.data
        //   let listObj = hoursRes.list
        //   let index = Math.floor((24-new Date().getHours())/3)
        //     console.log("index: ", index)
        // console.log("listData date",new Date(),new Date(hoursRes.data.hourly[5].dt*1000).toISOString())
          let {current,timezone_offset} = hoursRes.data
          let filterDate= convertFilterDate(current.dt,timezone_offset)
          let hourlyData = hoursRes.data.hourly.map((d)=>{

              return {
                  hourTime:convertTime(new Date((d.dt+timezone_offset)*1000).toISOString()),
                  date:new Date((d.dt+timezone_offset)*1000).toISOString(),
                  temp:d.temp,
                  icon:d.weather[0].icon,
                  ...d
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
        const daily =  hoursRes.data.daily[0]
        // console.log("daily dt",daily.dt,new Date(daily.dt*1000))
        let weatherData = {
          location: response.data.name,
          temperature: current.temp,
          min_temp: daily.temp.min,
          max_temp: daily.temp.max,
          description,
          icon,
          feels_like:current.feels_like,
          sunrise:convertHoursAndMinute(current.sunrise,timezone_offset),
          sunset:convertHoursAndMinute(current.sunset,timezone_offset),
          moonrise:convertHoursAndMinute(daily.moonrise,timezone_offset),
          moonset:convertHoursAndMinute(daily.moonset,timezone_offset),
          date: convertFullDate(current.dt,timezone_offset),
          hourly:hourlyData.slice(0,10),
          daily:hoursRes.data.daily
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

const convertFullDate = (dt,timezone) => {
    let monthArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    let date = new Date((dt+timezone)*1000)
    // console.log("convertFullDate current date",date)
    // console.log(" convertFullDate current day",date.getDate())
    return `${date.getDate()} ${monthArray[date.getMonth()]} ${date.getFullYear()}`

}

const convertHoursAndMinute = (time,timezone)=>{
  let date = new Date((time+timezone)*1000).toISOString()
  // console.log(" convertHoursAndMinute date: ",date)
  // console.log("convertHoursAndMinute date get hours: ",date.getHours())
  let HMArr = date.split("T")[1].split(":")
  return `${HMArr[0]}:${HMArr[1]}`
 
}

const convertFilterDate=(dt,timezone)=>{
  // console.log("convertFilterDate dt: ",dt)
  let date = new Date((dt+timezone)*1000)
  // console.log("convertFilterDate date: ",date)
  // console.log("convertFilterDate date get hours: ",date.getHours())
  let hoursData = date.toISOString().split("T")[1].split(":")[0]
  let filterDate = `${date.getFullYear()}-${date.getMonth()+1>=10?date.getMonth()+1:'0'+(date.getMonth()+1)}-${date.getDate()>=10?date.getDate():'0'+date.getDate()}T${hoursData}:00:00.000Z`
  // console.log("convertFilterDate filterDate",filterDate)
  return filterDate
}



module.exports = {currentWeather}