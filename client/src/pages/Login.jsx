import React, { useState, useEffect } from "react";
import Form from "../components/Form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setToken, setUser }) {
  // State variables to store user input and application state
  const [username, setUsername] = useState(""); // Stores the username input
  const [password, setPassword] = useState(""); // Stores the password input
  const [errorMessage, setErrorMessage] = useState(""); // Stores login error messages
  const [isLoading, setIsLoading] = useState(false); // Indicates whether the login request is being processed
  const navigate = useNavigate(); // Hook for programmatic navigation

  // List of background images that will be rotated in the UI
  const images = [
    "/demophotos/picture1.png",
    "/demophotos/picture2.png",
    "/demophotos/picture3.png",
    "/demophotos/picture4.png",
    "/demophotos/picture5.png",
  ];
  const [currentImage, setCurrentImage] = useState(images[0]); // Sets the initial background image

  // useEffect hook to cycle through background images every 5 seconds
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % images.length; // Loops through the images array
      setCurrentImage(images[index]); // Updates the background image
    }, 5000); // Runs every 5 seconds

    return () => clearInterval(interval); // Cleans up interval when component unmounts
  }, []);

  // Function to handle user login when the form is submitted
  async function loginUser(e) {
    e.preventDefault(); // Prevents the default form submission behavior

    // Validate input fields
    if (!username || !password) {
      setErrorMessage("Both fields are required.");
      return;
    }

    setErrorMessage(""); // Clear previous error messages
    setIsLoading(true); // Set loading state to true while processing request

    try {
      // Send login request to the API
      const response = await axios.post(
        "https://food-celebrator.onrender.com/api/auth/login",
        { username, password }
      );

      // If login is successful and a token is received
      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", token); // Store token in local storage
        setToken(token); // Update token state

        try {
          // Fetch user data with the received token
          const userResponse = await axios.get(
            "https://food-celebrator.onrender.com/api/auth/me",
            {
              headers: { Authorization: `${token}` }, // Proper format for Bearer token
            }
          );
          setUser(userResponse.data); // Update user state with retrieved user data
          navigate("/account"); // Redirect to the account page
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
        <h1 className="text-3xl font-bold text-center text-font dark:text-darkfont">
          Login
        </h1>

        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-500 bg-red-100 dark:bg-red-900 text-center px-4 py-2 rounded-lg shadow-md mt-4">
            {errorMessage}
          </p>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <p className="text-gray-500 text-center animate-pulse mt-4">
            Processing...
          </p>
        )}

        {/* Login Form */}
        <div className="mt-6">
          <Form
            submitFunction={loginUser}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
