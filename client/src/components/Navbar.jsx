import React, { useState } from "react";
import { Link } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle"; // Dark mode toggle component

function Navbar({ token, handleLogout }) {
  const [isOpen, setIsOpen] = useState(false); // Fix missing state for mobile menu

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 dark:bg-darkbackground/70 backdrop-blur-md shadow-lg text-foreground dark:text-darkforeground">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo & Branding */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="Library Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl font-bold tracking-tight text-primary dark:text-darkprimary">
              BookBuddy
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            to="/"
            className="hover:text-secondary dark:hover:text-darksecondary transition font-medium"
          >
            Home
          </Link>
          {token ? (
            <>
              <Link
                to="/me"
                className="hover:text-secondary dark:hover:text-darksecondary transition font-medium"
              >
                My Account
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
                to="/register"
                className="hover:text-secondary dark:hover:text-darksecondary transition font-medium"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="hover:text-secondary dark:hover:text-darksecondary transition font-medium"
              >
                Login
              </Link>
            </>
          )}

          {/* Dark Mode Toggle */}
          <DarkModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <DarkModeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="ml-4 text-foreground dark:text-darkforeground"
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background dark:bg-darkbackground p-4 space-y-3 text-center">
          <Link
            to="/"
            className="block hover:text-primary dark:hover:text-darkprimary"
          >
            Home
          </Link>
          {token ? (
            <>
              <Link
                to="/me"
                className="block hover:text-primary dark:hover:text-darkprimary"
              >
                My Account
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
                to="/register"
                className="block hover:text-primary dark:hover:text-darkprimary"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="block hover:text-primary dark:hover:text-darkprimary"
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
