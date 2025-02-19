import React from "react";

function Form({
  parent,
  submitFunction,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}) {
  return (
    <form className="form-container" onSubmit={submitFunction}>
      {parent === "register" && (
        <label htmlFor="username">
          <h3>Username</h3>
          <input
            id="username"
            type="text"
            placeholder="User Name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
      )}
      <label htmlFor="email">
        <h3>Email</h3>
        <input
          id="email"
          type="email"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label htmlFor="password">
        <h3>Password</h3>
        <input
          id="password"
          type="password"
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {parent === "register" && (
        <label htmlFor="confirmPassword">
          <h3>Confirm Password</h3>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password..."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
      )}
      <button type="submit">
        {parent === "register" ? "Register" : "Log In"}
      </button>
    </form>
  );
}

export default Form;
