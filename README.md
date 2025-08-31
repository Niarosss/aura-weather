[English](./README.md) | [Українська](./README.uk.md)

# Aura Weather App 🌦️

Aura is a modern, responsive weather app built using Vite and React. It displays real-time weather data for selected cities, supports multiple locations, theming, and an animated UI.

## Demo

👉 [View the live version on GitHub Pages](https://niarosss.github.io/aura-weather/)

## Features

- Auto-detects user geolocation
- Search weather by city name
- Dark/light theme toggle
- Manage multiple cities at once
- Pin favorite cities with `localStorage`
- Animated UI using **Framer Motion**
- Auto-refresh every 2 hours

## Technologies Used

- **Framework**: [React](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **API**: [OpenWeatherMap API](https://openweathermap.org/api)
- **Styles**: SCSS / CSS modules

## Project Structure

The codebase is organized for clarity and ease of maintenance:

```
aura-weather/
├── public/                        # a folder with public resources (e.g., static files).
├── src/
│  └── assets/
│     └── styles/                  # Application styles (SCSS modules)
│        ├── App.scss              # Global styles & base layout
│        ├── Card.scss             # Weather card styles
│        ├── Details.scss          # Styles for weather details section
│        ├── Form.scss             # Search form styles
│        ├── RotatingText.scss     # Animations/styles for rotating text
│        ├── SplashScreen.scss     # Splash screen styling
│        └── ThemeToggle.scss      # Light/Dark theme toggle styles
│
├── components/                    # Reusable React components
│  ├── AppParticlesBackground.jsx  # Animated particles background
│  ├── Loader.jsx                  # Loading indicator
│  ├── RotatingText.jsx            # Rotating/animated text element
│  ├── SplashScreen.jsx            # Initial splash screen on app start
│  ├── WeatherCard.jsx             # Card with short weather info
│  ├── WeatherDetails.jsx          # Extended weather details (humidity, wind, etc.)
│  └── WeatherForm.jsx             # Search form for city/location input
│
├── services/
│  └── WeatherService.js           # Service for handling weather API requests
│
├── App.jsx                        # Main application component
├── main.jsx                       # Entry point, mounts React app
```
