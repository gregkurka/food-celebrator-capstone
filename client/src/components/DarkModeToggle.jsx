import React, { useState, useEffect } from "react";

export default function DarkModeToggle() {
  // State for tracking dark mode
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Effect to apply the dark class on mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="px-4 py-2 text-sm font-medium rounded-md transition 
             bg-gray-200 text-gray-900 border border-gray-400 
             dark:bg-gray-700 dark:text-white dark:border-gray-500"
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}
