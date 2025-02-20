import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import Account from "./pages/Account";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import Footer from "./components/Footer";

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
      const response = await axios.get("http://localhost:3000/api/auth/me", {
        headers: { Authorization: token },
      });
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
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header token={token} handleLogout={handleLogout} />
      <main className="flex-grow">
        <Routes>
          <Route
            path="/login"
            element={<Login setToken={setToken} setUser={setUser} />}
          />
          <Route
            path="/signup"
            element={<Signup setToken={setToken} setUser={setUser} />}
          />
          <Route path="/feed" element={<Feed />} />
          <Route
            path="/account"
            element={<Account token={token} user={user} />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function ProtectedRoute({ token, children }) {
  return token ? children : <Navigate to="/login" />;
}

export default App;
