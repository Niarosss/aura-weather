import { useEffect, useState } from "react";

import SplashScreen from "./components/SplashScreen";
import AppParticlesBackground from "./components/AppParticlesBackground";

import WeatherForm from "./components/WeatherForm";
import WeatherCard from "./components/WeatherCard";
import WeatherDetails from "./components/WeatherDetails";

import { Sun, Moon, CircleSlash2 } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import "./assets/styles/App.scss";
import "./assets/styles/ThemeToggle.scss";

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Новий стан для сплеш-скріну
  const [showSplash, setShowSplash] = useState(() => {
    // Показувати сплеш-скрін при кожному завантаженні сторінки
    // Якщо треба показувати лише один раз при першому візиті:
    // const hasVisited = localStorage.getItem('hasVisited');
    // return hasVisited ? false : true;
    return true;
  });

  const [pinned, setPinned] = useState(() => {
    const savedPinned = localStorage.getItem("pinned");
    return savedPinned ? JSON.parse(savedPinned) : [];
  });

  const [locations, setLocations] = useState(() => {
    const savedPinned = localStorage.getItem("pinned");
    return savedPinned ? JSON.parse(savedPinned) : [];
  });

  useEffect(() => {
    localStorage.setItem("pinned", JSON.stringify(pinned));
  }, [pinned]);

  // Додаємо локацію
  const addLocations = (cityName) => {
    if (locations.includes(cityName)) {
      return { error: "Ця локація вже додана." };
    } else {
      setLocations((prev) => [cityName, ...prev]);
    }
  };

  // Видалення локації
  const removeLocations = (nameToRemove) => {
    setLocations((prev) => prev.filter((name) => name !== nameToRemove));
    setPinned((prev) => prev.filter((name) => name !== nameToRemove));
  };

  // Закріплення / Відкріплення локації
  const togglePinLocation = (cityName) => {
    if (pinned.includes(cityName)) {
      setPinned((prev) => prev.filter((name) => name !== cityName));
      // Якщо відкріплюємо, і це місто не закріплене, але є в locations,
      // ми можемо захотіти його видалити зі списку, або залишити до ручного видалення.
      // Залишаємо його в locations, щоб користувач міг його відразу видалити.
    } else {
      setPinned((prev) => [...prev, cityName]);
      // Якщо закріплюємо, переконайтеся, що воно є в locations
      if (!locations.includes(cityName)) {
        setLocations((prev) => [cityName, ...prev]);
      }
    }
  };

  // Тема
  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleStartApp = () => {
    setShowSplash(false);
    // Якщо треба показувати сплеш-скрін лише один раз:
    // localStorage.setItem('hasVisited', 'true');
  };

  const handleSelectCity = (city) => {
    setSelectedCity(city);
  };

  const handleBackToOverview = () => {
    setSelectedCity(null);
  };

  const sortedAndRenderedWeatherCard = [...locations]
    .sort((a, b) => {
      const aPinned = pinned.includes(a);
      const bPinned = pinned.includes(b);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    })
    .map((city) => (
      <WeatherCard
        key={city}
        city={city}
        pinned={pinned.includes(city)}
        onRemove={() => removeLocations(city)}
        onTogglePin={() => togglePinLocation(city)}
        onSelectCity={handleSelectCity}
      />
    ));

  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <>
      <AppParticlesBackground />

      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen
            key="splash-screen"
            onStart={handleStartApp}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        ) : (
          <>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Змінити тему"
            >
              {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <motion.div
              className="weather"
              key="app-content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              layout
            >
              <AnimatePresence initial={false} mode="wait">
                {selectedCity ? (
                  <WeatherDetails
                    key={selectedCity}
                    city={selectedCity}
                    onBack={handleBackToOverview}
                  />
                ) : (
                  <motion.div
                    key="weather-overview-content"
                    className="weather__main-content"
                    layout
                  >
                    <LayoutGroup>
                      <motion.div className="weather__list" layout>
                        <AnimatePresence>
                          {locations.length === 0 ? (
                            <motion.div
                              key="no-info-placeholder"
                              className="weather__list-placeholder"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ duration: 0.3 }}
                              layout
                            >
                              <CircleSlash2 size={48} color="#6363638f" />
                              <p>
                                Інформація відсутня. Будь ласка, додайте
                                локацію.
                              </p>
                            </motion.div>
                          ) : (
                            sortedAndRenderedWeatherCard
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </LayoutGroup>

                    <WeatherForm
                      key="weather-form"
                      addLocations={addLocations}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
