import { Sun, Moon } from "lucide-react";
import "../assets/styles/ThemeToggle.scss";

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Змінити тему"
    >
      {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
}

export default ThemeToggle;
