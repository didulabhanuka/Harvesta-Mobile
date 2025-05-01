// /services/weatherService.js

import axios from 'axios';

const WEATHER_API_KEY = '90236cee1d1649588b2193845251103'; // Replace with your real API key

export const fetchWeatherByCoords = async (latitude, longitude) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Weather fetch error:', error.message);
    throw error;
  }
};
