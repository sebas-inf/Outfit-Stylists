import React, { useEffect, useState } from "react"

export function CurrentWeatherCard({ weatherData, timezone }) {
  const [times, setTimes] = useState({
    currentDate: "",
    currentTime: "",
    sunriseTime: "",
    sunsetTime: ""
  })

  useEffect(() => {
    
    if (!weatherData || !weatherData.dt) return

    let currentDateObject = new Date(weatherData.dt * 1000)
    let sunriseDateObject = new Date(weatherData.sunrise * 1000)
    let sunsetDateObject = new Date(weatherData.sunset * 1000)

    let currentDateString = currentDateObject.toString()
    let sunriseDateString = sunriseDateObject.toString()
    let sunsetDateString = sunsetDateObject.toString()

    let currentTime = currentDateString.substring(16, 24)
    let currentDate = currentDateString.substring(0, 3) + ", " + currentDateString.substring(4, 15)

    let sunriseTime = sunriseDateString.substring(16, 24)
    let sunsetTime = sunsetDateString.substring(16, 24)

    setTimes({
      currentDate: currentDate,
      currentTime: currentTime,
      sunriseTime: sunriseTime,
      sunsetTime: sunsetTime
    })
  }, [weatherData])

  return (
    <div className="bg-white shadow-lg rounded-lg min-w-96">
      
      <div className="bg-blue-500 text-white text-center py-4">
        <h2 className="text-2xl font-semibold">Current Weather Information</h2>
      </div>

      
      <div className="p-6 text-gray-800">
        <div className="text-center mb-4">
          <p className="text-xl font-medium">
            {weatherData.weather && weatherData.weather[0]?.main}
          </p>
          <p>
            {weatherData.weather && weatherData.weather[0]?.description}
          </p>
          <p>{timezone}</p>
        </div>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span>Current Date:</span>
            <span>{times.currentDate}</span>
          </li>
          <li className="flex justify-between">
            <span>Current Time:</span>
            <span>{times.currentTime}</span>
          </li>
          <li className="flex justify-between">
            <span>Temperature:</span>
            <span>{weatherData.temp}°F</span>
          </li>
          <li className="flex justify-between">
            <span>Feels Like:</span>
            <span>{weatherData.feels_like}°F</span>
          </li>
          <li className="flex justify-between">
            <span>Sunrise:</span>
            <span>{times.sunriseTime}</span>
          </li>
          <li className="flex justify-between">
            <span>Sunset:</span>
            <span>{times.sunsetTime}</span>
          </li>
        </ul>
      </div>
    </div>
  )
}