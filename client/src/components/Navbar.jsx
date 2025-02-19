import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-green-400">
              MyApp
            </Link>
          </div>

          {/* Nav Links (Hidden on Small Screens) */}
          <div className="hidden md:flex space-x-6">
            <Link to="/feed" className="hover:text-green-400 transition">
              Feed
            </Link>
            <Link to="/account" className="hover:text-green-400 transition">
              Account
            </Link>
            <Link to="/login" className="hover:text-green-400 transition">
              Login
            </Link>
            <Link to="/signup" className="hover:text-green-400 transition">
              Signup
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Only Visible When Open) */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 p-4 space-y-3 text-center">
          <Link to="/feed" className="block hover:text-green-400">
            Feed
          </Link>
          <Link to="/account" className="block hover:text-green-400">
            Account
          </Link>
          <Link to="/login" className="block hover:text-green-400">
            Login
          </Link>
          <Link to="/signup" className="block hover:text-green-400">
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
