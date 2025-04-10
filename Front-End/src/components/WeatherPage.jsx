
import React, { useState } from 'react';
import axios from 'axios';
import { CurrentWeatherCard } from './CurrentWeatherCard'; 

const API_KEY = 'aecda3d849f7d8b7a6a60a0a3ad7a95b'; 

function WeatherPage() {
  const [coordinates, setCoordinates] = useState({ latitude: 29.65, longitude: -82.32 });
  const [currentData, setCurrentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [timezone, setTimezone] = useState("");

  const handleLocationSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.latitude}&lon=${coordinates.longitude}&units=imperial&appid=${API_KEY}`
      );
      setCurrentData(response.data.current);
      setTimezone(response.data.timezone);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleChange = (e) => {
    setCoordinates({ ...coordinates, [e.target.name]: Number(e.target.value) });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Weather</h1>
      <form onSubmit={handleLocationSearch} style={{ marginBottom: '20px' }}>
        <input
          placeholder="Latitude"
          name="latitude"
          type="number"
          step="0.01"
          min="-90"
          max="90"
          required
          value={coordinates.latitude}
          onChange={handleChange}
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <input
          placeholder="Longitude"
          name="longitude"
          type="number"
          step="0.01"
          min="-180"
          max="180"
          required
          value={coordinates.longitude}
          onChange={handleChange}
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