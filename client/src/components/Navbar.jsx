import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle"; // Dark mode toggle component

function Navbar({ token, handleLogout }) {
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
    <nav
      className="fixed left-0 top-0 h-full w-64 bg-background/80 dark:bg-darkbackground/80 
                 backdrop-blur-md shadow-lg text-foreground dark:text-darkforeground 
                 flex flex-col justify-between py-6 px-4 transition-all duration-500 md:flex hidden"
    >
      {/* Logo & Branding */}
      <div className="flex items-center space-x-3 mb-10">
        <Link to="/feed" className="flex items-center space-x-2">
          <img
            src="/logonowords.png"
            alt="AppLogo"
            className="w-12 h-12 object-contain"
          />
          <span className="text-2xl font-extrabold tracking-wide text-font dark:text-darkfont">
            Food Celebrator
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col space-y-6">
        <Link
          to="/"
          className="hover:text-secondary dark:hover:text-darksecondary transition font-medium flex items-center space-x-4"
        >
          <div className="w-12 h-12 flex justify-center items-center">
            <img
              src={
                isDarkMode ? "/icons/homeIconDark.png" : "/icons/homeIcon.png"
              }
              alt="Home Icon"
              className="w-11 h-9"
            />
          </div>
          <span className="text-left text-lg">Home</span>
        </Link>
        {token ? (
          <>
            <Link
              to="/feed"
              className="hover:text-secondary dark:hover:text-darksecondary transition font-medium flex items-center space-x-4"
            >
              <div className="w-12 h-12 flex justify-center items-center">
                <img
                  src={
                    isDarkMode
                      ? "/icons/feedIconDark.png"
                      : "/icons/feedIcon.png"
                  }
                  alt="Feed Icon"
                  className="w-30 h-13"
                />
              </div>
              <span className="text-left text-lg">Feed</span>
            </Link>
            <Link
              to="/account"
              className="hover:text-secondary dark:hover:text-darksecondary transition font-medium flex items-center space-x-4"
            >
              <div className="w-12 h-12 flex justify-center items-center">
                <img
                  src={
                    isDarkMode
                      ? "/icons/accountIconDark.png"
                      : "/icons/accountIcon.png"
                  }
                  alt="Account Icon"
                  className="w-9 h-9"
                />
              </div>
              <span className="text-left text-lg">Account</span>
            </Link>
            <button
              onClick={handleLogout}
              className="hover:text-red-400 dark:hover:text-red-500 transition font-medium flex items-center space-x-4"
            >
              <div className="w-12 h-12 flex justify-center items-center">
                <img
                  src={
                    isDarkMode
                      ? "/icons/logoutIconDark.png"
                      : "/icons/logoutIcon.png"
                  }
                  alt="Logout Icon"
                  className="w-10 h-10"
                />
              </div>
              <span className="text-left text-lg">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/signup"
              className="hover:text-secondary dark:hover:text-darksecondary transition font-medium flex items-center space-x-4"
            >
              <div className="w-12 h-12 flex justify-center items-center">
                <img
                  src={
                    isDarkMode
                      ? "/icons/signupIconDark.png"
                      : "/icons/signupIcon.png"
                  }
                  alt="Sign Up Icon"
                  className="w-10 h-10"
                />
              </div>
              <span className="text-left text-lg">Sign Up</span>
            </Link>
            <Link
              to="/login"
              className="hover:text-secondary dark:hover:text-darksecondary transition font-medium flex items-center space-x-4"
            >
              <div className="w-12 h-12 flex justify-center items-center">
                <img
                  src={
                    isDarkMode
                      ? "/icons/loginIconDark.png"
                      : "/icons/loginIcon.png"
                  }
                  alt="Login Icon"
                  className="w-10 h-10"
                />
              </div>
              <span className="text-left text-lg">Login</span>
            </Link>
          </>
        )}
      </div>

      {/* Dark Mode Toggle at Bottom */}
      <div className="mt-auto">
        <DarkModeToggle />
      </div>
    </nav>
  );
}

export default Navbar;
