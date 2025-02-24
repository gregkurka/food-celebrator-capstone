import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import Account from "./pages/Account";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UserPage from "./pages/UserPage";
import Home from "./pages/Home";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";

function App() {
  // State to store authentication token
  const [token, setToken] = useState(null);
  // State to store user data
  const [user, setUser] = useState(null);
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // useEffect runs when the component mounts to check if a token exists in local storage
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      verifyToken(localToken); // Validate the token
    }
  }, []);

  // Function to verify token validity and fetch user data
  const verifyToken = useCallback(async (token) => {
    try {
      const response = await axios.get("http://localhost:3000/api/auth/me", {
        headers: { Authorization: token },
      });
      setToken(token); // Store the token in state
      setUser(response.data); // Store user data
    } catch (error) {
      console.error("Invalid or expired token, logging out.");
      handleLogout(); // Call logout function if token is invalid
    }
  }, []);

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from storage
    setToken(null); // Clear token state
    setUser(null); // Clear user data
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header component, passing token and logout function as props */}
      <Header token={token} handleLogout={handleLogout} />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
          {/* Login page route, passing setToken and setUser as props */}
          <Route
            path="/login"
            element={<Login setToken={setToken} setUser={setUser} />}
          />
          {/* Signup page route, passing setToken and setUser as props */}
          <Route
            path="/signup"
            element={<Signup setToken={setToken} setUser={setUser} />}
          />
          {/* Feed page route, accessible to all users */}
          <Route path="/feed" element={<Feed user={user} />} />
          {/* Account page route, passing token and user data */}
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

      {/* Footer component */}
      <Footer />
    </div>
  );
}

export default App;
