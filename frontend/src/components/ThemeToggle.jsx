import { useRef, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useReducedMotion } from "framer-motion";

function persistTheme(theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.setAttribute("content", getComputedStyle(root).getPropertyValue("--paper").trim());
  }
  try {
    window.localStorage.setItem("portfolio-theme", theme);
  } catch (error) {
    console.warn("Could not save the selected theme:", error);
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "light",
  );
  const buttonRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const applyTheme = () => {
      persistTheme(nextTheme);
      setTheme(nextTheme);
    };

    if (!reduceMotion && typeof document.startViewTransition === "function") {
      const bounds = buttonRef.current?.getBoundingClientRect();
      if (bounds) {
        document.documentElement.style.setProperty(
          "--theme-origin-x",
          `${bounds.left + bounds.width / 2}px`,
        );
        document.documentElement.style.setProperty(
          "--theme-origin-y",
          `${bounds.top + bounds.height / 2}px`,
        );
      }
      document.startViewTransition(applyTheme);
      return;
    }

    const root = document.documentElement;
    root.classList.add("theme-switching");
    applyTheme();
    window.setTimeout(() => root.classList.remove("theme-switching"), 420);
  };

  return (
    <button
      ref={buttonRef}
      className={`theme-toggle${theme === "dark" ? " is-dark" : ""}`}
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      aria-pressed={theme === "dark"}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        {theme === "dark" ? <FaMoon /> : <FaSun />}
      </span>
      <span className="theme-toggle-label">{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
