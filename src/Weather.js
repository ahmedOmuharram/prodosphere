import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { weatherContext } from "./App"

function WeatherComponent ( lat ) {
  const latitude = lat.lat;
  const longitude = lat.lon;
  const [weatherData, setWeatherData] = useState(null);
  const { setWeatherState } = useContext(weatherContext);

  const fetchWeatherData = async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      setWeatherData(data);
      setWeatherState(data);
    } catch (error) {
      console.error("Error fetching weather data: ", error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  });

  return (
    <div>
      {weatherData ? (
        <div>
            <motion.div
                    whileHover={{ opacity: 1 }}
                    initial={{ opacity: 0.4 }}
                    transition={{ duration: 0.3 }}
                >
                <div style={{ fontSize: "24px"}}>
                   🌡️ {Math.round(weatherData.main.temp)}°C
                </div>
            </motion.div>
            <motion.div
                whileHover={{ opacity: 1 }}
                initial={{ opacity: 0.4 }}
                transition={{ duration: 0.3 }}
            >
              <div style={{ fontSize: "16px" }}>💧 {weatherData.main.humidity}% | 💨 {(weatherData.wind.speed * 3.6).toFixed(1)} km/h</div>
            </motion.div>
        </div>
      ) : (
        <div style={{ fontSize: "18px", opacity: "0.3" }}>Loading...</div>
      )}
    </div>
  );
}
// {weatherData.main.temp * 9 / 5 + 32}°F for Fahrenheit
export default WeatherComponent
