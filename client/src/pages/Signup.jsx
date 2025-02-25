import React, { useState, useEffect } from "react";
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
        "https://food-celebrator.onrender.com/api/auth/register",
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
  const images = [
    "/demophotos/picture1.png",
    "/demophotos/picture2.png",
    "/demophotos/picture3.png",
    "/demophotos/picture4.png",
    "/demophotos/picture5.png",
  ];

  const [currentImage, setCurrentImage] = useState(images[0]); // Sets initial background

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % images.length; // Loops through the images array
      setCurrentImage(images[index]); // Updates background
    }, 5000); // Runs every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center 
                 text-foreground dark:text-darkforeground 
                 px-6 py-12 md:py-20 animate-fadeIn transition-all duration-700"
      style={{
        backgroundImage: `url(${currentImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl shadow-md backdrop-blur-lg">
        <h1 className="text-3xl font-bold text-center text-primary dark:text-darkprimary">
          Sign Up
        </h1>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 bg-red-100 dark:bg-red-900 text-center px-4 py-2 rounded-lg shadow-md mt-4">
            {error}
          </p>
        )}

        {/* Loading Indicator */}
        {loading && (
          <p className="text-gray-500 text-center animate-pulse mt-4">
            Processing...
          </p>
        )}

        {/* Signup Form */}
        <div className="mt-6">
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
      </div>
    </div>
  );
}

export default Signup;
