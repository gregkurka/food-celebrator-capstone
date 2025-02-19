import React, { useState } from "react";
import Form from "../components/Form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  async function loginUser(e) {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Both fields are required.");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        alert("Login successful!");
        navigate("/me");
      }
    } catch (err) {
      setErrorMessage(
        `${err.response.data.message}. Please check your credentials.`
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      {errorMessage && (
        <p className="error-message" style={{ color: "red" }}>
          {errorMessage}
        </p>
      )}
      {isLoading && <p>Loading...</p>}
      <Form
        submitFunction={loginUser}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
    </div>
  );
}

export default Login;
