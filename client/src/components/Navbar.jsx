import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/login" className="text-2xl font-bold text-green-400">
              MyApp
            </Link>
          </div>

          <div className="hidden md:flex space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/feed" className="hover:text-green-400 transition">
                  Feed
                </Link>
                <Link to="/account" className="hover:text-green-400 transition">
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-red-400 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-green-400 transition">
                  Login
                </Link>
                <Link to="/signup" className="hover:text-green-400 transition">
                  Signup
                </Link>
              </>
            )}
          </div>

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

      {isOpen && (
        <div className="md:hidden bg-gray-800 p-4 space-y-3 text-center">
          <Link to="/feed" className="block hover:text-green-400">
            Feed
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/account" className="block hover:text-green-400">
                Account
              </Link>
              <button onClick={handleLogout} className="block text-red-400">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block hover:text-green-400">
                Login
              </Link>
              <Link to="/signup" className="block hover:text-green-400">
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
