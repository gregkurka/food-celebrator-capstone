import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle"; // Import Dark Mode Toggle

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/70 dark:bg-darkbackground/70 
                    backdrop-blur-md shadow-lg text-foreground dark:text-darkforeground"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo & Branding */}
        <div className="flex items-center space-x-3">
          <Link to="/feed" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="Food Celebrator Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl font-bold tracking-tight text-primary dark:text-darkprimary">
              Food Celebrator
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8 items-center">
          {isAuthenticated ? (
            <>
              <Link
                to="/feed"
                className="hover:text-secondary dark:hover:text-darksecondary transition font-medium"
              >
                Feed
              </Link>
              <Link
                to="/account"
                className="hover:text-secondary dark:hover:text-darksecondary transition font-medium"
              >
                Account
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-red-400 dark:hover:text-red-500 transition font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-secondary dark:hover:text-darksecondary transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hover:text-secondary dark:hover:text-darksecondary transition font-medium"
              >
                Signup
              </Link>
            </>
          )}

          {/* Dark Mode Toggle */}
          <DarkModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          {/* Dark Mode Toggle for Mobile */}
          <DarkModeToggle />

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="ml-4 text-foreground dark:text-darkforeground focus:outline-none"
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background dark:bg-darkbackground p-4 space-y-3 text-center">
          <Link
            to="/feed"
            className="block hover:text-primary dark:hover:text-darkprimary"
          >
            Feed
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/account"
                className="block hover:text-primary dark:hover:text-darkprimary"
              >
                Account
              </Link>
              <button
                onClick={handleLogout}
                className="block text-red-500 dark:text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block hover:text-primary dark:hover:text-darkprimary"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block hover:text-primary dark:hover:text-darkprimary"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
