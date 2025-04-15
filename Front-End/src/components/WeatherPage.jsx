
import React, { useState } from 'react';
import axios from 'axios';
import { CurrentWeatherCard } from './CurrentWeatherCard'; 

const API_KEY = 'aecda3d849f7d8b7a6a60a0a3ad7a95b'; 

function WeatherPage() {
  
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [city, setCity] = useState(""); 
  const [currentData, setCurrentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [timezone, setTimezone] = useState("");

  
  const handleLocationSearch = async (e) => {
    e.preventDefault();
    try {
      
      const geoResponse = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );
      if (geoResponse.data && geoResponse.data.length > 0) {
        const { lat, lon } = geoResponse.data[0];
        setCoordinates({ latitude: lat, longitude: lon });
        
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
        );
        setCurrentData(weatherResponse.data.current);
        setTimezone(weatherResponse.data.timezone);
        setLoading(false);
      } else {
        console.error("No result");
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

 
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Weather</h1>
      <form onSubmit={handleLocationSearch} style={{ marginBottom: '20px' }}>
        <input
          placeholder="Enter city name"
          name="city"
          type="text"
          required
          value={city}
          onChange={handleCityChange}
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>
          Search
        </button>
      </form>
      
      {!loading && <CurrentWeatherCard weatherData={currentData} timezone={timezone} />}
    </div>
  );
}

export default WeatherPage;