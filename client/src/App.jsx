import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import Account from "./pages/Account";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserPage from "./pages/UserPage";
import Home from "./pages/Home";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar"; // Import Sidebar Navbar
import Footer from "./components/Footer";
import MobileNavbar from "./components/MobileNavbar"; // Import Mobile Navbar
import RecipeLibrary from "./components/RecipeLibrary/RecipeLibrary";
import RecipeDetails from "./components/RecipeLibrary/RecipeDetails";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      verifyToken(localToken);
    }
  }, []);

  const verifyToken = useCallback(async (token) => {
    try {
      const response = await axios.get(
        "https://food-celebrator.onrender.com/api/auth/me",
        {
          headers: { Authorization: token },
        }
      );
      setToken(token);
      setUser(response.data);
    } catch (error) {
      console.error("Invalid or expired token, logging out.");
      handleLogout();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="flex">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex w-64 h-screen fixed top-0 left-0">
        <Navbar token={token} handleLogout={handleLogout} />
      </div>

      {/* Mobile Navbar for Small Screens */}
      <div className="md:hidden w-full fixed top-0 left-0 z-50">
        <MobileNavbar token={token} handleLogout={handleLogout} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-black">
        <main className="flex-grow pt-16 md:pt-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />} />
            <Route path="/recipes" element={<RecipeLibrary />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route
              path="/login"
              element={<Login setToken={setToken} setUser={setUser} />}
            />
            <Route
              path="/signup"
              element={<Signup setToken={setToken} setUser={setUser} />}
            />
            <Route path="/feed" element={<Feed user={user} />} />
            <Route
              path="/account"
              element={<Account token={token} user={user} />}
            />
            <Route path="/user" element={<Account />} />
            <Route path="/user/:username" element={<UserPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
