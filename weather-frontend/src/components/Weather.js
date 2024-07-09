import React,{useState,useEffect} from "react";
import axios from 'axios'


const Weather = () =>{
    const [weatherData, setWeatherData] = useState({
        location:"delhi",
        temperature:30.25,
        description:"mist",
        icon:"10n",
        date:"06 jul 2024",
        feels_like:34.25,
        sunset:"19:36"
    })
    const [error,setError] = useState(true)
    const [location,setLocation] = useState("delhi")
    const [newData,setNewData] = useState("")
    const WEATHER_APP_BASE_URL = process.env.NODE_ENV==="production"?"https://r2b-weather-app.netlify.app":"http://localhost:4000"

    const fetchData = async (location)=>{
        try{
            const response = await axios.get(`${WEATHER_APP_BASE_URL}/api/v1/current/weather?location=${location}`)
            console.log("weather date: ",response.data)
            setWeatherData(response.data)
            setError(false)
        } catch(error){
            console.error(error)
            
        }
    }

    useEffect(()=>{
        fetchData(location)
    },[])

    useEffect(()=>{
    
    },[newData])

    const handleWeatherData=async()=>{
        await fetchData(location)
        setNewData(location)
    }

    return (
        <div>
            <div className="p-4 bg-white shadow-md rounded-md flex flex-col md:flex-row items-center gap-4">
            <input type="text" className="border border-gray-300 p-2 rounded-md w-full md:w-auto flex-grow" placeholder="Enter Location" onChange={(e) => setLocation(e.target.value)}/>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleWeatherData}>Search</button>
        </div>
            <div className="flex flex-col md:flex-row h-full gap-4 p-4">
                {error?<h1>Loading....</h1>:
                (
                    <>
                        <div className="md:w-1/3 bg-gray-500 rounded-3xl">
                            <h3 className="text-center mt-4 text-white font-medium text-2xl">Today</h3>
                            <div className="flex justify-center">
                                <img className="h-40 w-40 mr-2" src={`https://openweathermap.org/img/wn/${weatherData.icon}.png`} alt={weatherData.description} />
                                <h2 className="text-7xl font-extrabold text-white mt-8">{weatherData.temperature}&deg;</h2>
                            </div>
                            <p className="text-white font-bold text-2xl text-center">{weatherData.description}</p>
                            <p className="text-white text-lg font-medium text-center mt-4">{weatherData.location}</p>
                            <p className="text-white text-lg font-medium text-center mt-4">{weatherData.date}</p>
                            <div className="text-center text-white font-medium text-lg mt-4 mb-4">
                                <div>
                                    feels like {weatherData.feels_like} | sunset {weatherData.sunset}
                                </div>
                            </div>
                            
                            
                        </div>
                        <div className="w-full md:w-2/3 flex flex-col gap-4 h-2/3 md:h-full ">

                            <div className="flex-1  bg-gray-500 p-4 grid md:grid-cols-5 gap-4 rounded-3xl">
                                {weatherData.hourly.map((i,idx)=>(

                                    <div className="flex flex-col justify-between p-2 rounded">
                                        <div className="text-white text-center">
                                            <span>{idx===0?"Now":i.hourTime}</span>
                                        </div>
                                        {/* <div className="border-b border-white my-2"></div> */}
                                        <div className="flex justify-center items-center space-x-2">
                                            <img className="" src={`https://openweathermap.org/img/wn/${i.icon}.png`} alt={weatherData.description} />  
                                            <span className="text-white">{i.temp}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* <div className="border-gray my-2"></div> */}
                            
                            {/* <div className="flex-1 bg-green-500 h-full rounded-md"></div> */}

                        </div>
                    </>  
                )}
            </div>
        </div>
    )
}

export default Weather