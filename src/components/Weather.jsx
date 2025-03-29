import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [error, setError] = useState(null);
  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };
  useEffect(() => {
    // Load recent searches
    setError(null);
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }

    // const savedDarkMode = localStorage.getItem("darkMode");
    // if (savedDarkMode !== null) {
    //   setDarkMode(JSON.parse(savedDarkMode));
    // } else {
    //   // const prefersDarkMode = window.matchMedia(
    //   //   "(prefers-color-scheme: dark)"
    //   // ).matches;
    //   setDarkMode(prefersDarkMode);
    // }

    // Initial search
    // Get user's location if available, otherwise use default city
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        () => {
          // Fallback to default city if geolocation is denied
          search("London");
        }
      );
    } else {
      search("London");
    }
  }, []);

  // Apply dark mode to body when darkMode state changes
  useEffect(() => {
    
    if (darkMode) {
      document.body.classList.add("dark-mode-body");
    } else {
      document.body.classList.remove("dark-mode-body");
    }

    // Save preference to localStorage
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setError(null);
      setLoading(true);
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=a50e6f279fa99e8e3d8f053ade9d080e`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        processWeatherData(data);
        fetchForecast(data.name);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      // Fallback to default city
      setError("Error fetching weather by coordinates:");
      search("London");
    }
  };

  const apiRequest = async (city) => {
    try {
      setLoading(true);
      setError(null);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=a50e6f279fa99e8e3d8f053ade9d080e`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setLoading(false);
      return data;
    } catch (error) {
      setWeatherData(false);
      setError("Error in fetching the information")
      console.error(error);
      setLoading(false);
      return null;
    }
  };

  const fetchForecast = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=a50e6f279fa99e8e3d8f053ade9d080e`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === "200") {
        // Process 5-day forecast data
        // const dailyData = processForecastData(data.list);
        // setForecastData(dailyData);
      }
    } catch (error) {
      console.error("Error fetching forecast:", error);
    }
  };

  // Process weather data
  const processWeatherData = (data) => {
    const icon = allIcons[data.weather[0].icon] || clear_icon;
    setWeatherData({
      humidity: data.main.humidity,
      windspeed: data.wind.speed,
      temperature: Math.round(data.main.temp),
      location: data.name,
      icon: icon,
      description: data.weather[0].description,
    });
  };

  // const processForecastData = (forecastList) => {
  //   const dailyForecasts = {};

  //   forecastList.forEach((item) => {
  //     const date = new Date(item.dt * 1000).toISOString().split("T")[0];

  //     const today = new Date().toISOString().split("T")[0];
  //     if (date === today) return;

  //     if (!dailyForecasts[date]) {
  //       dailyForecasts[date] = {
  //         date,
  //         temps: [],
  //         icons: [],
  //         descriptions: [],
  //       };
  //     }

  //     dailyForecasts[date].temps.push(item.main.temp);
  //     dailyForecasts[date].icons.push(item.weather[0].icon);
  //     dailyForecasts[date].descriptions.push(item.weather[0].description);
  //   });

  //   // Convert to array and calculate daily averages
  //   return Object.values(dailyForecasts)
  //     .map((day) => {
  //       // Calculate average temperature
  //       const avgTemp =
  //         day.temps.reduce((sum, temp) => sum + temp, 0) / day.temps.length;

  //       // Find the most common icon and description
  //       const iconCounts = {};
  //       day.icons.forEach((icon) => {
  //         iconCounts[icon] = (iconCounts[icon] || 0) + 1;
  //       });
  //       const mostCommonIcon = Object.entries(iconCounts).sort(
  //         (a, b) => b[1] - a[1]
  //       )[0][0];

  //       const descriptionCounts = {};
  //       day.descriptions.forEach((desc) => {
  //         descriptionCounts[desc] = (descriptionCounts[desc] || 0) + 1;
  //       });
  //       const mostCommonDescription = Object.entries(descriptionCounts).sort(
  //         (a, b) => b[1] - a[1]
  //       )[0][0];

  //       return {
  //         date: day.date,
  //         avgTemp: Math.round(avgTemp),
  //         icon: mostCommonIcon,
  //         description: mostCommonDescription,
  //       };
  //     })
  //     .slice(0, 5); // Limit to 5 days
  // };

  const addToRecentSearches = (cityName) => {
    if (!cityName) return;

    // Create new array without the current city (if it exists)
    const filteredSearches = recentSearches.filter(
      (city) => city.toLowerCase() !== cityName.toLowerCase()
    );
    const newSearches = [cityName, ...filteredSearches].slice(0, 5);

    setRecentSearches(newSearches);
    localStorage.setItem("recentSearches", JSON.stringify(newSearches));
  };

  const search = async (city) => {
    if (!city) {
      city = inputRef.current.value;
      if (!city.trim()) {
        setError("Enter city name");
        return;
      }
    }

    const data = await apiRequest(city);
    if (!data || data.cod === "404") {
      setError("City not found");
      return;
    }

    processWeatherData(data);
    if (data.name) {
      addToRecentSearches(data.name);
      fetchForecast(data.name);
    }
  };

  const searchFromHistory = (city) => {
    if (inputRef.current) {
      inputRef.current.value = city;
    }
    search(city);
  };

  const refreshWeather = () => {
    if (weatherData && weatherData.location) {
      search(weatherData.location);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  return (
    <div className={`Weather ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className="top-controls">
        <button onClick={toggleDarkMode} className="mode-toggle">
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
        {weatherData && (
          <button
            onClick={refreshWeather}
            className="refresh-button"
            aria-label="Refresh weather"
          >
            🔄
          </button>
        )}
      </div>

      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter city name"
          onKeyPress={handleKeyPress}
          aria-label="Search for a city"
        />
        <img src={search_icon} alt="Search" onClick={() => search()} />
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="recent-searches">
          <h3>Recent Searches</h3>
          <div className="search-history">
            {recentSearches.map((city, index) => (
              <button
                key={index}
                onClick={() => searchFromHistory(city)}
                className="history-item"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && <div className="loading-indicator">Loading</div>}
      {error && <div>{error}</div>}


      {!loading && weatherData ? (
        <>
          <img
            src={weatherData.icon}
            alt={weatherData.description || "Weather Icon"}
            className="weather-icon"
          />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.location}</p>
          {weatherData.description && (
            <p
              style={{
                textAlign: "center",
                textTransform: "capitalize",
                margin: "0 0 20px",
              }}
            >
              {weatherData.description}
            </p>
          )}
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="Wind" />
              <div>
                <p>{weatherData.windspeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
          {/* {forecastData.length > 0 && (
            <div className="forecast-container">
              <h3>5-Day Forecast</h3>
              <div className="forecast">
                {forecastData.map((day, index) => (
                  <div key={index} className="forecast-day">
                    <p className="forecast-date">{formatDate(day.date)}</p>
                    <img
                      src={allIcons[day.icon] || clear_icon}
                      alt={day.description}
                      className="forecast-icon"
                    />
                    <p className="forecast-temp">{day.avgTemp}°C</p>
                    <p className="forecast-desc">{day.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </>
      ) : (
        !loading && (
          <div style={{ textAlign: "center", margin: "30px 0" }}>
            Enter a city to see weather information
          </div>
        )
      )}
    </div>
  );
};

export default Weather;
