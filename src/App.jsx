import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import WeatherForm from "./components/WeatherForm";
import WeatherCard from "./components/WeatherCard";

import WeatherDetails from "./components/WeatherDetails";

import "./assets/styles/App.scss";

function App() {
  const [selectedCity, setSelectedCity] = useState(null);

  const [pinned, setPinned] = useState(
    () => JSON.parse(localStorage.getItem("pinned")) || []
  );
  const [locations, setLocations] = useState(
    () => JSON.parse(localStorage.getItem("pinned")) || []
  );

  useEffect(() => {
    localStorage.setItem("pinned", JSON.stringify(pinned));
  }, [pinned]);

  const addLocation = (city) => {
    if (locations.includes(city)) return { error: "Вже додано" };
    setLocations((prev) => [city, ...prev]);
  };

  const removeLocation = (city) => {
    setLocations((prev) => prev.filter((c) => c !== city));
    setPinned((prev) => prev.filter((c) => c !== city));
  };

  const togglePin = (city) => {
    setPinned((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  // Сортування для рендеру
  const sortedLocations = useMemo(() => {
    return [...locations].sort(
      (a, b) => pinned.includes(b) - pinned.includes(a)
    );
  }, [locations, pinned]);

  return (
    <div className="app">
      <div className="app__wrapper">
        <AnimatePresence mode="wait">
          <motion.main className="app__content" layout layoutRoot>
            <AnimatePresence mode="wait" initial={false}>
              {selectedCity ? (
                <WeatherDetails
                  key="details"
                  city={selectedCity}
                  onBack={() => setSelectedCity(null)}
                />
              ) : (
                <motion.div
                  key="weather-view"
                  className="app__weather-view"
                  layout
                  layoutRoot
                >
                  <WeatherForm addLocations={addLocation} />

                  <motion.div className="app__list">
                    <AnimatePresence>
                      {locations.length === 0 ? (
                        <motion.div
                          key="empty-state"
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                        >
                          <WeatherCard isEmptyPlaceholder={true} />
                        </motion.div>
                      ) : (
                        sortedLocations.map((city) => (
                          <motion.div
                            key={city}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                          >
                            <WeatherCard
                              city={city}
                              pinned={pinned.includes(city)}
                              onRemove={() => removeLocation(city)}
                              onTogglePin={() => togglePin(city)}
                              onSelectCity={setSelectedCity}
                            />
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
