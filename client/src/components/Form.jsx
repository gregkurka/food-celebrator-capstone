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
    <form
      className="bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md mx-auto text-white backdrop-blur-md"
      onSubmit={submitFunction}
    >
      <h2 className="text-2xl font-bold text-center text-green-400 mb-6">
        {parent === "signup" ? "Signup" : "Login"}
      </h2>

      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="User Name..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-2 mt-1 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
        />
      </div>

      {parent === "signup" && (
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 mt-1 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 mt-1 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
        />
      </div>

      {parent === "signup" && (
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password..."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 mt-1 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-md transition duration-200 shadow-md"
      >
        {parent === "signup" ? "Signup" : "Log In"}
      </button>
    </form>
  );
}

export default Form;
