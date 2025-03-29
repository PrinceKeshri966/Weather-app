# Weather App

## Tech Stack Used
- **Frontend:** React.js
- **Styling:** CSS
- **API:** OpenWeatherMap API

## Setup Instructions

### Prerequisites
- Node.js installed on your machine
- A valid OpenWeatherMap API key

### Installation Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/PrinceKeshri966/Weather-app.git
   cd weather-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:
   ```sh
   REACT_APP_WEATHER_API_KEY=your_api_key_here
   ```
4. Start the application:
   ```sh
   npm start
   ```
5. Open `http://localhost:5173` in your browser to see the app in action.

## API Integration Details
- **API Used:** OpenWeatherMap API
- **Endpoints:**
  - Current Weather: `https://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid={API_KEY}`
  - Weather by Coordinates: `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={API_KEY}`
- **Rate Limits:** The free tier allows up to 60 requests per minute.
- **API Key Requirement:** The API key must be provided in the `appid` parameter for each request.

## Features
- Fetches real-time weather data based on user input or geolocation
- Displays weather information including temperature, humidity, wind speed, and description
- Implements dark mode
- Stores recent searches in local storage
- Provides a refresh option to update weather data

## License
This project is open-source and available under the MIT License.

