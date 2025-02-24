import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle"; // Dark mode toggle component

function MobileNavbar({ token, handleLogout }) {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Track dark mode state dynamically
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode(); // Check on mount

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect(); // Cleanup on unmount
  }, []);

  return (
    <nav className="bg-background dark:bg-darkbackground shadow-md backdrop-blur-md">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/feed" className="flex items-center space-x-2">
          <img
            src="/logonowords.png"
            alt="AppLogo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-bold tracking-tight text-foreground dark:text-darkforeground">
            Food Celebrator
          </span>
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <DarkModeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-foreground dark:text-darkforeground"
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="bg-background dark:bg-darkbackground p-4 text-center space-y-3">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 py-2 text-foreground dark:text-darkforeground hover:text-primary dark:hover:text-darkprimary transition"
          >
            <img
              src={
                isDarkMode ? "/icons/homeIconDark.png" : "/icons/homeIcon.png"
              }
              alt="Home Icon"
              className="w-6 h-6"
            />
            <span>Home</span>
          </Link>

          {token ? (
            <>
              <Link
                to="/feed"
                className="flex items-center justify-center space-x-2 py-2 text-foreground dark:text-darkforeground hover:text-primary dark:hover:text-darkprimary transition"
              >
                <img
                  src={
                    isDarkMode
                      ? "/icons/feedIconDark.png"
                      : "/icons/feedIcon.png"
                  }
                  alt="Feed Icon"
                  className="w-6 h-6"
                />
                <span>Feed</span>
              </Link>

              <Link
                to="/account"
                className="flex items-center justify-center space-x-2 py-2 text-foreground dark:text-darkforeground hover:text-primary dark:hover:text-darkprimary transition"
              >
                <img
                  src={
                    isDarkMode
                      ? "/icons/accountIconDark.png"
                      : "/icons/accountIcon.png"
                  }
                  alt="Account Icon"
                  className="w-6 h-6"
                />
                <span>My Account</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 py-2 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition"
              >
                <img
                  src={
                    isDarkMode
                      ? "/icons/logoutIconDark.png"
                      : "/icons/logoutIcon.png"
                  }
                  alt="Logout Icon"
                  className="w-6 h-6"
                />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="flex items-center justify-center space-x-2 py-2 text-foreground dark:text-darkforeground hover:text-primary dark:hover:text-darkprimary transition"
              >
                <img
                  src={
                    isDarkMode
                      ? "/icons/signupIconDark.png"
                      : "/icons/signupIcon.png"
                  }
                  alt="Signup Icon"
                  className="w-6 h-6"
                />
                <span>Sign Up</span>
              </Link>

              <Link
                to="/login"
                className="flex items-center justify-center space-x-2 py-2 text-foreground dark:text-darkforeground hover:text-primary dark:hover:text-darkprimary transition"
              >
                <img
                  src={
                    isDarkMode
                      ? "/icons/loginIconDark.png"
                      : "/icons/loginIcon.png"
                  }
                  alt="Login Icon"
                  className="w-6 h-6"
                />
                <span>Login</span>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default MobileNavbar;
