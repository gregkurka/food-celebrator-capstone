import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "../components/Form";

function Signup({ setToken }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function registerUser(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      setError("Please enter a valid email.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/auth/register",
        { username, email, password }
      );

      if (data.id) {
        alert("Successfully signed up!");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center 
                 backgroundcolor text-foreground dark:text-darkforeground 
                 px-6 py-12 md:py-20 animate-fadeIn"
    >
      {/* Page Title */}
      <h2
        className="text-4xl font-extrabold text-primary dark:text-darkprimary 
                   text-center tracking-wide mb-6"
      >
        Create Your Account
      </h2>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 bg-red-100 dark:bg-red-900 text-center px-4 py-2 rounded-lg shadow-md mb-4">
          {error}
        </p>
      )}

      {/* Loading Indicator */}
      {loading && (
        <p className="text-gray-500 text-center animate-pulse">Processing...</p>
      )}

      {/* Signup Form */}
      <Form
        parent="signup"
        submitFunction={registerUser}
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
      />
    </div>
  );
}

export default Signup;
