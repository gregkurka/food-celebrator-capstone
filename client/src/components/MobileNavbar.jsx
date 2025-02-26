import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle"; // Dark mode toggle component

function MobileNavbar({ token, handleLogout }) {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
  const [isDarkMode, setIsDarkMode] = useState(false);
  const locations = useLocation(); //--get current location--
  const navbarRef = useRef(null); //--ref for navbar container--

  //--close the hamburger menu when the route changes--
  useEffect(() => {
    setIsOpen(false);
  }, [locations]);

  //--if the mobile menu is open, event listener is active & listening for clicks or touches.
  useEffect(() => {
    const handleOutsideClicks = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClicks);
    document.addEventListener("touchstart", handleOutsideClicks);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClicks);
      document.removeEventListener("touchstart", handleOutsideClicks);
    };
  }, []);

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
    <nav
      ref={navbarRef}
      className="bg-background dark:bg-darkbackground shadow-md backdrop-blur-md"
    >
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo (Switches for Light/Dark Mode) */}
        <Link to="/feed" className="flex items-center space-x-2">
          <img
            src={isDarkMode ? "/logoDark.png" : "/logo.png"}
            alt="App Logo"
            className="w-10 h-10 object-contain transition-all duration-300"
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
            className="text-foreground dark:text-darkforeground text-2xl focus:outline-none"
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="bg-background dark:bg-darkbackground p-4 text-center space-y-3">
          <NavItem to="/" icon="homeIcon" text="Home" isDarkMode={isDarkMode} />

          {token ? (
            <>
              <NavItem
                to="/feed"
                icon="feedIcon"
                text="Feed"
                isDarkMode={isDarkMode}
              />
              <NavItem
                to="/account"
                icon="accountIcon"
                text="My Account"
                isDarkMode={isDarkMode}
              />
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 py-2 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition"
              >
                <NavIcon icon="logoutIcon" isDarkMode={isDarkMode} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavItem
                to="/signup"
                icon="signupIcon"
                text="Sign Up"
                isDarkMode={isDarkMode}
              />
              <NavItem
                to="/login"
                icon="loginIcon"
                text="Login"
                isDarkMode={isDarkMode}
              />
            </>
          )}
        </div>
      )}
    </nav>
  );
}

// Reusable Nav Item Component
const NavItem = ({ to, icon, text, isDarkMode }) => (
  <Link
    to={to}
    className="flex items-center justify-center space-x-2 py-2 text-foreground dark:text-darkforeground 
               hover:text-primary dark:hover:text-darkprimary transition"
  >
    <NavIcon icon={icon} isDarkMode={isDarkMode} />
    <span>{text}</span>
  </Link>
);

// Reusable Nav Icon Component
const NavIcon = ({ icon, isDarkMode }) => (
  <img
    src={isDarkMode ? `/icons/${icon}Dark.png` : `/icons/${icon}.png`}
    alt={`${icon} icon`}
    className="w-6 h-6 object-contain"
  />
);

export default MobileNavbar;
