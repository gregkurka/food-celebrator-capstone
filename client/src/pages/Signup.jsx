import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "../components/Form";

function Signup({ setToken }) {
  // State variables to manage user input and application status
  const [username, setUsername] = useState(""); // Stores the username input
  const [email, setEmail] = useState(""); // Stores the email input
  const [password, setPassword] = useState(""); // Stores the password input
  const [confirmPassword, setConfirmPassword] = useState(""); // Stores the confirm password input
  const [error, setError] = useState(null); // Stores error messages
  const [loading, setLoading] = useState(false); // Tracks if the registration request is in progress
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle user registration when the form is submitted
  async function registerUser(e) {
    e.preventDefault(); // Prevents the default form submission behavior

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate email format using a regex pattern
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      setError("Please enter a valid email.");
      return;
    }

    setError(null); // Clear previous error messages
    setLoading(true); // Set loading state to true while processing request

    try {
      // Send registration request to the API
      const { data } = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          username,
          email,
          password,
        }
      );

      // If the API response includes a user ID, registration was successful
      if (data.id) {
        alert("Successfully signed up!"); // Notify user of successful signup
        navigate("/login"); // Redirect user to the login page
      }
    } catch (err) {
      // Handle registration failure and display appropriate error message
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  }

  return (
    <div>
      {/* Page header */}
      <h2 className="text-2xl font-bold text-center text-primary dark:text-darksecondary mb-6">
        Register Here
      </h2>

      {/* Display error messages if any */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Show loading indicator when request is processing */}
      {loading && <p className="text-center">Loading...</p>}

      {/* Signup form component with necessary props */}
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
