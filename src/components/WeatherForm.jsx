// components/WeatherForm.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Eraser, Plus, X } from "lucide-react";
import {
  getCityNameByCoords,
  checkCityExistsAndGetName,
} from "../services/WeatherService";
import "../assets/styles/Form.scss";

function WeatherForm({ addLocations }) {
  const [cityInput, setCityInput] = useState("");
  const [inputError, setInputError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const cityInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && cityInputRef.current) {
      cityInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (inputError) {
      const timer = setTimeout(() => {
        setInputError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [inputError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        if (result?.error) {
          setInputError(result.error);
        } else {
          setCityInput("");
          setInputError(null);
          setIsOpen(false);
        }
      }
    } catch (error) {
      setInputError(error.message);
    }
  };

  const handleGeoLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const officialCityName = await getCityNameByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          if (officialCityName) {
            const result = addLocations(officialCityName);
            if (result?.error) {
              setInputError(result.error);
              setIsOpen(true);
            }
          }
        } catch (error) {
          setInputError(error.message);
          setIsOpen(true);
        }
      },
      (error) => {
        setInputError("Не вдалося отримати геолокацію.");
        setIsOpen(true);
      }
    );
  };

  return (
    <div className="form__wrapper">
      <motion.div className="form__container">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="form"
              initial={{ maxWidth: 0, opacity: 0 }}
              animate={{ maxWidth: 500, opacity: 1 }}
              exit={{ maxWidth: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <form className="form__inner" onSubmit={handleSubmit}>
                <div className="form__input-group">
                  <div className="form__field">
                    <input
                      className="form__input"
                      ref={cityInputRef}
                      type="text"
                      placeholder="Введіть місто..."
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                    />
                    {cityInput && (
                      <Eraser
                        size={16}
                        className="form__icon-clear"
                        onClick={() => setCityInput("")}
                      />
                    )}
                  </div>
                  <button type="submit" className="form__btn">
                    <Search
                      size={16}
                      color="var(--heading)"
                      className="form__icon"
                    />
                  </button>
                </div>
                <button
                  type="button"
                  className="form__btn-icon"
                  onClick={handleGeoLocation}
                >
                  <MapPin size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className="form__btn-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              style={{ display: "flex", alignItems: "center" }}
              key={isOpen ? "open" : "closed"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? (
                <X size={28} color="#dc3545" />
              ) : (
                <Plus size={28} color="#28a745" />
              )}
            </motion.div>
          </AnimatePresence>
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && inputError && (
          <motion.p
            className="form__error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {inputError}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WeatherForm;
