import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";


function WeatherComponent( lat ) {
  const latitude = lat.lat;
  const longitude = lat.lon;
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeatherData = async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      console.log(apiKey)
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

      const response = await fetch(apiUrl);
      console.log(response)
      const data = await response.json();
      console.log(data)

      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data: ", error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <div>
      {weatherData ? (
        <div>
            <motion.div
                    whileHover={{ opacity: 1 }}
                    initial={{ opacity: 0.4 }}
                    transition={{ duration: 0.3 }}
                >
                <div style={{ fontSize: "28px", marginTop: "-15px", marginBottom: "-15px" }}>
                    <img
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    style={{ width: "60px", height: "60px", marginRight: "-10px", marginBottom: "5px", paddingRight: "0px" }}
                    alt={weatherData.weather[0].main}
                    />
                    {weatherData.weather[0].main} | 🌡️ {Math.round(weatherData.main.temp)}°C
                </div>
            </motion.div>
            <motion.div
                whileHover={{ opacity: 1 }}
                initial={{ opacity: 0.4 }}
                transition={{ duration: 0.3 }}
            >
              <div style={{ fontSize: "20px" }}>💧 {weatherData.main.humidity}% | 💨 {weatherData.wind.speed} m/s</div>
            </motion.div>
        </div>
      ) : (
        <div style={{ fontSize: "18px", opacity: "0.3" }}>Loading...</div>
      )}
    </div>
  );
}
// {weatherData.main.temp * 9 / 5 + 32}°F for Fahrenheit
/*
    <motion.div
      whileHover={{ opacity: 1 }}
      initial={{ opacity: 0.4 }}
      transition={{ duration: 0.3 }}
    >
        <div style={{ fontSize: "20px" }}>💧 {weatherData.main.humidity}% | 💨 {weatherData.wind.speed} m/s</div>
    </motion.div>
*/
export default WeatherComponent;
