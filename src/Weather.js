import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { weatherContext } from "./App"

function WeatherComponent ({ lat, lon }) {
  const latitude = lat;
  const longitude = lon;
  const [weatherData, setWeatherData] = useState(null);
  const { weatherState, setWeatherState } = useContext(weatherContext);

  const fetchWeatherData = async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      setWeatherData(data);
      setWeatherState(data);
      setLastWeatherFetchData(data); 
    } catch (error) {
      console.error("Error fetching weather data: ", error);
    }
  };

  useEffect(() => {
    if (shouldFetchWeatherData()) {
      fetchWeatherData();
    } else {
      const lastWeatherData = getLastWeatherFetchData();
      setWeatherData(lastWeatherData);
      setWeatherState(lastWeatherData);
    }
  }, []);

  const oneHourInMilliseconds = 60 * 60 * 1000;

  const shouldFetchWeatherData = () => {
    const lastWeatherTimestamp = getLastWeatherFetchTimestamp();
    const currentTimestamp = Date.now();
    return currentTimestamp - lastWeatherTimestamp > oneHourInMilliseconds;
  };

  const getLastWeatherFetchTimestamp = () => {
    const lastWeatherTimestamp = localStorage.getItem("lastWeatherTimestamp");
    return lastWeatherTimestamp ? parseInt(lastWeatherTimestamp) : 0;
  };

  const setLastWeatherFetchTimestamp = () => {
    const currentTimestamp = Date.now();
    localStorage.setItem("lastWeatherTimestamp", currentTimestamp.toString());
  };

  const getLastWeatherFetchData = () => {
    const lastWeatherData = localStorage.getItem("lastWeatherData");
    return lastWeatherData ? JSON.parse(lastWeatherData) : null;
  };

  const setLastWeatherFetchData = (data) => {
    localStorage.setItem("lastWeatherData", JSON.stringify(data));
    setLastWeatherFetchTimestamp();
  };

  return (
    <div>
      {weatherData && weatherState !== null && weatherState.weather && weatherState.weather.length > 0 ? (
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
        <></>
      )}
    </div>
  );
}
// {weatherData.main.temp * 9 / 5 + 32}°F for Fahrenheit
export default WeatherComponent
