import { useEffect, useState } from "react";
import Loader from "./Loader";
import { getWeatherData } from "../services/WeatherService";
import { motion, AnimatePresence } from "framer-motion";
import "../assets/styles/Card.scss";
import {
  Pin,
  PinOff,
  Trash2,
  Thermometer,
  Droplet,
  Wind,
  CircleGauge,
} from "lucide-react";

function WeatherCard({ city, pinned, onRemove, onTogglePin, onSelectCity }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        // Використовуємо кешовану версію виклику API
        const weatherData = await getWeatherData({ cityName: city });
        setData(weatherData);
      } catch (err) {
        setError(err.message);
        console.error("Помилка при отриманні погоди:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [city]);

  const handleClick = () => {
    if (onSelectCity) {
      onSelectCity(city);
    }
  };

  return (
    <motion.div
      className={`card ${pinned ? "pinned" : ""}`}
      transition={{ duration: 0.3 }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      layout
      style={{ position: "relative", cursor: "pointer" }} // Додаємо cursor: pointer
      onClick={handleClick} // <--- Додаємо обробник кліку
    >
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              borderRadius: "8px",
            }}
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && data && (
        <>
          <h2 className="card__name">{data.name}</h2>

          <div className="card__stats">
            <img
              src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
              alt={data.description}
              style={{ width: "128px", height: "128px", margin: "-24px" }}
            />
            <div className="card__temp-block">
              <p className="card__temp">{Math.round(data.temp)} °C</p>
              <p>{data.description}</p>
            </div>
          </div>

          <div className="card__description">
            <div className="card__block">
              <Droplet size={16} color="var(--heading)" />
              <p>
                {data.humidity}
                <span className="small"> %</span>
              </p>
            </div>
            <div className="card__block">
              <Wind size={16} color="var(--heading)" />
              <p>
                {Math.round(data.wind_speed)} <span className="small">м/с</span>
              </p>
            </div>
            <div className="card__block">
              <CircleGauge size={16} color="var(--heading)" />
              <p>
                {data.pressure} <span className="small">гПа</span>
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            className="card__btn-control btn-pin"
          >
            {pinned ? <PinOff size={12} /> : <Pin size={12} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="card__btn-control btn-delete"
          >
            <Trash2 size={12} />
          </button>
        </>
      )}
    </motion.div>
  );
}

export default WeatherCard;
