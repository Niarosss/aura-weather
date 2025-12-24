import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import RotatingText from "./RotatingText";
import "../assets/styles/SplashScreen.scss";

const splashVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.5,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: -100,
    transition: { duration: 0.5, ease: "easeIn" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function SplashScreen({ onStart, theme, onToggleTheme }) {
  return (
    <motion.div
      className="splash-screen"
      variants={splashVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h1 variants={itemVariants} className="splash-screen__title">
        Aura Weather
      </motion.h1>
      <motion.div variants={itemVariants} className="splash-screen__subtitle">
        <span className="splash-screen__subtitle-static">
          Ваш точний прогноз для
        </span>
        <RotatingText
          texts={[
            "Києва",
            "Львова",
            "Одеси",
            "Харкова",
            "Дніпра",
            "Запоріжжя",
            "Чернівців",
            "всього світу!",
          ]}
          mainClassName="splash-screen__subtitle-rotate"
          staggerFrom={"last"}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.05}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={4000}
        />
      </motion.div>
      <motion.div variants={itemVariants} className="splash-screen__buttons">
        <motion.button
          onClick={onStart}
          className="splash-screen__start-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          aria-label="Почати використовувати застосунок"
        >
          Почати
        </motion.button>
        <motion.button
          onClick={onToggleTheme}
          className="splash-screen__theme-toggle"
          whileHover={{ rotate: 360, scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          aria-label="Змінити тему"
        >
          {theme === "dark" ? <Sun size={28} /> : <Moon size={28} />}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default SplashScreen;
