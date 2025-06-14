// src/components/WeatherDetails.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CloudRain,
  Sun,
  Droplet,
  Wind,
  Thermometer,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  Cloud,
} from "lucide-react";
import "../assets/styles/Details.scss";
import { getWeatherData } from "../services/WeatherService";
import Loader from "./Loader";

function WeatherDetails({ city, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const weatherData = await getWeatherData({
          cityName: city,
          fullDetails: true,
        });
        setData(weatherData);
      } catch (err) {
        setError(err.message);
        console.error("Помилка при отриманні детальної погоди:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [city]); // Залежність від city, щоб перезавантажувати при зміні міста

  // Функція для форматування часу сходу/заходу сонця
  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000); // OpenWeatherMap повертає UNIX timestamp в секундах
    return date.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      key={`details-${city}`} // Унікальний ключ для AnimatePresence
      initial={{ opacity: 0, scale: "0" }} // Анімація появи справа
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: "0" }} // Анімація зникнення вліво
      transition={{ duration: 0.3 }}
      className="details" // Додайте цей клас для стилізації
    >
      <button onClick={onBack} className="details__back-btn">
        <ArrowLeft size={20} /> Назад
      </button>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="details__error-message">Помилка: {error}</p>
      ) : data ? (
        <>
          <h2 className="details__title">{data.name}</h2>
          <div className="details__main">
            {data.icon && (
              <img
                src={`https://openweathermap.org/img/wn/${data.icon}@4x.png`} // Можна використовувати 4x для більшої іконки
                alt={data.description}
                className="details__icon"
              />
            )}
            <p className="details__temp">{Math.round(data.temp)}°C</p>
            <p className="details__description">{data.description}</p>
          </div>

          <div className="details__grid">
            <div className="details__item">
              <Thermometer size={20} />
              <span>Відчувається: {Math.round(data.feels_like)}°C</span>
            </div>
            <div className="details__item">
              <Droplet size={20} />
              <span>Вологість: {data.humidity}%</span>
            </div>
            <div className="details__item">
              <Wind size={20} />
              <span>Швидкість вітру: {Math.round(data.wind_speed)} м/с</span>
            </div>
            <div className="details__item">
              <Gauge size={20} />
              <span>Тиск: {data.pressure} гПа</span>
            </div>
            <div className="details__item">
              <Cloud size={20} />
              <span>Хмарність: {data.clouds}</span>
            </div>
            {/* Додамо більше деталей, якщо вони доступні в data */}
            {data.visibility && ( // Поле visibility не завжди є у free API, перевіряйте
              <div className="details__item">
                <Eye size={20} />
                <span>Видимість: {data.visibility / 1000} км</span>
              </div>
            )}
            {data.sys &&
              data.sys.sunrise && ( // Час сходу сонця
                <div className="details__item">
                  <Sunrise size={20} />
                  <span>Схід сонця: {formatTime(data.sys.sunrise)}</span>
                </div>
              )}
            {data.sys &&
              data.sys.sunset && ( // Час заходу сонця
                <div className="details__item">
                  <Sunset size={20} />
                  <span>Захід сонця: {formatTime(data.sys.sunset)}</span>
                </div>
              )}
            {/* Додайте інші деталі, які ви хочете показати */}
            {/* Наприклад, опади (якщо є в API відповіді) */}
            {data.rain && data.rain["1h"] && (
              <div className="details__item">
                <CloudRain size={20} />
                <span>Опади (1 год): {data.rain["1h"]} мм</span>
              </div>
            )}
            {data.snow && data.snow["1h"] && (
              <div className="details__item">
                <Snowflake size={20} />
                <span>Сніг (1 год): {data.snow["1h"]} мм</span>
              </div>
            )}
          </div>
        </>
      ) : null}
    </motion.div>
  );
}

export default WeatherDetails;
