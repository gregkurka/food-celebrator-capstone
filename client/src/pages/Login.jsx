import React, { useState, useEffect } from "react";
import Form from "../components/Form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const images = [
    "/basedlogo.png",
    "/coffee.png",
    "/pancakes.png",
    "/pizza.png",
    "/salad.png",
    "/steak.jpg",
  ]; // List of images in your public folder
  const [currentImage, setCurrentImage] = useState(images[0]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % images.length; // Loop through the images
      setCurrentImage(images[index]);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  async function loginUser(e) {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage("Both fields are required.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { username, password }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token); // Set token state

        try {
          await axios.get("http://localhost:3000/api/auth/me", {
            headers: { Authorization: `${response.data.token}` },
          });

          alert("Login successful!");
          navigate("/account");
        } catch (userError) {
          console.error("Failed to fetch user data:", userError);
          setErrorMessage("Login successful, but failed to load user info.");
        }
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: `url(${currentImage})` }}
    >
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md bg-opacity-90">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Login
        </h2>
        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}
        {isLoading && <p className="text-center text-gray-500">Loading...</p>}
        <Form
          submitFunction={loginUser}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    </div>
  );
}

export default Login;
