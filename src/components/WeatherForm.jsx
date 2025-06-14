// components/WeatherForm.jsx
import { useState, useEffect, useRef } from "react";
import { Search, MapPin, XCircle, CirclePlus, CircleX } from "lucide-react"; // Додаємо MapPin
import { motion, AnimatePresence } from "framer-motion";
import {
  getCityNameByCoords,
  checkCityExistsAndGetName,
} from "../services/WeatherService"; // Для отримання даних по гео
import "../assets/styles/Form.scss";

function WeatherForm({ addLocations }) {
  const [cityInput, setCityInput] = useState("");
  const [inputError, setInputError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Фокус по реф
  const cityInputRef = useRef(null);
  const focusInput = () => {
    if (cityInputRef.current) {
      cityInputRef.current.focus();
    }
  };

  useEffect(() => {
    let timer;
    if (inputError) {
      timer = setTimeout(() => {
        setInputError(null); // Очищаємо помилку через 5 секунд
      }, 5000); // 5 секунд
    }
    return () => {
      clearTimeout(timer); // Очищаємо таймер при розмонтуванні або зміні inputError
    };
  }, [inputError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInputError(null);

    const trimmedCityInput = cityInput.trim();

    if (!trimmedCityInput) {
      setInputError("Будь ласка, введіть назву міста.");
      return;
    }

    try {
      const officialCityName = await checkCityExistsAndGetName(
        trimmedCityInput
      );

      if (officialCityName) {
        const result = addLocations(officialCityName);
        if (!result) {
          setCityInput("");
          setInputError(null);
          setShowForm(false);
        } else {
          setInputError(result.error);
        }
      }
    } catch (err) {
      setInputError(err.message);
    }
  };

  const handleGeolocation = async () => {
    setInputError(null); // Очищаємо попередні помилки перед новою спробою

    if (!navigator.geolocation) {
      setInputError("Ваш браузер не підтримує геолокацію.");
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;

      const weatherData = await getCityNameByCoords(latitude, longitude);
      if (weatherData) {
        const result = addLocations(weatherData);
        if (!result) {
          setCityInput("");
          setInputError(null);
          setShowForm(false);
        } else {
          setInputError(result.error);
        }
      } else {
        setInputError("Не вдалось визначити місто за вашими координатами.");
      }
    } catch (err) {
      if (err.code === err.PERMISSION_DENIED) {
        setInputError("Доступ до геолокації відмовлено.");
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        setInputError("Інформація про місцезнаходження недоступна.");
      } else if (err.code === err.TIMEOUT) {
        setInputError("Час очікування геолокації вичерпано.");
      } else {
        setInputError("Помилка отримання місцезнаходження. Спробуйте пізніше.");
      }
    }
  };

  return (
    <motion.div className="form__wrapper" key="menu" layout>
      <AnimatePresence initial={false}>
        <motion.button
          key="form-btn"
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ x: showForm ? 115 : 275 }}
          className={`form__toggle ${showForm ? "cancel" : "add"}`}
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? <CircleX size={16} /> : <CirclePlus size={16} />}
        </motion.button>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 115 }}
            exit={{ opacity: 0, x: 200 }}
            transition={{ duration: 0.3 }}
            className="form"
            onSubmit={handleSubmit}
            onAnimationComplete={() => {
              if (showForm) {
                focusInput();
              }
            }}
          >
            <div className="form__group">
              <input
                ref={cityInputRef}
                type="text"
                placeholder="Введіть назву міста"
                className="form__input"
                value={cityInput}
                onChange={(e) => {
                  setCityInput(e.target.value);
                  setInputError(null);
                }}
              />
              <AnimatePresence>
                {inputError && (
                  <motion.div
                    key="input-error-message"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="form__error"
                  >
                    {inputError}
                    <button
                      type="button"
                      onClick={() => setInputError(null)}
                      className="form__error-close-btn"
                      aria-label="Приховати помилку"
                    >
                      <XCircle size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <button type="submit" className="form__submit" title="Пошук">
                <Search size={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleGeolocation}
              className="form__button"
              title="Визначити моє місцезнаходження"
            >
              <MapPin size={16} />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default WeatherForm;
