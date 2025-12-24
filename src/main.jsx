import "modern-css-reset";
import App from "./App.jsx";
import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import AppParticlesBackground from "./components/AppParticlesBackground.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import SplashScreen from "./components/SplashScreen.jsx";
import "./assets/styles/main.scss";

const Main = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <StrictMode>
      <AppParticlesBackground theme={theme} />
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen
            onStart={() => setShowSplash(false)}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        ) : (
          <motion.div key="main-app" style={{ height: "100%" }}>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <App />
          </motion.div>
        )}
      </AnimatePresence>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")).render(<Main />);
