import React from "react";
import { Routes, Route } from "react-router-dom";
import Account from "./pages/Account";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import Footer from "./components/Footer";

// import "./App.css";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
