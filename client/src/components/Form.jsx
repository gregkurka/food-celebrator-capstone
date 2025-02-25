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
      className="bg-gray-400/80 dark:bg-gray-800/80 p-8 rounded-xl shadow-xl 
                 max-w-md mx-auto text-white backdrop-blur-lg border border-gray-700 dark:border-gray-600
                 transition-all duration-300"
      onSubmit={submitFunction}
    >
      {/* Title */}
      <h2 className="text-3xl font-extrabold text-center text-font dark:text-darkfont mb-6">
        {parent === "signup" ? "Create an Account" : "Welcome Back, Foodie"}
      </h2>

      {/* Username */}
      <div className="mb-5">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-font dark:text-darkfont"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="Enter your username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-3 mt-2 bg-gray-800/60 dark:bg-gray-700/60 text-white border 
                     border-gray-600 dark:border-gray-500 rounded-lg shadow-md 
                     focus:ring-2 focus:ring-primary dark:focus:ring-darkprimary focus:outline-none 
                     transition-all duration-300"
        />
      </div>

      {/* Email (Only in Signup) */}
      {parent === "signup" && (
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-font dark:text-darkfont"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 mt-2 bg-gray-800/60 dark:bg-gray-700/60 text-white border 
                       border-gray-600 dark:border-gray-500 rounded-lg shadow-md 
                       focus:ring-2 focus:ring-primary dark:focus:ring-darkprimary focus:outline-none 
                       transition-all duration-300"
          />
        </div>
      )}

      {/* Password */}
      <div className="mb-5">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-font dark:text-darkfont"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 mt-2 bg-gray-800/60 dark:bg-gray-700/60 text-white border 
                     border-gray-600 dark:border-gray-500 rounded-lg shadow-md 
                     focus:ring-2 focus:ring-primary dark:focus:ring-darkprimary focus:outline-none 
                     transition-all duration-300"
        />
      </div>

      {/* Confirm Password (Only in Signup) */}
      {parent === "signup" && (
        <div className="mb-5">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-font dark:text-darkfont"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password..."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 mt-2 bg-gray-800/60 dark:bg-gray-700/60 text-white border 
                       border-gray-600 dark:border-gray-500 rounded-lg shadow-md 
                       focus:ring-2 focus:ring-primary dark:focus:ring-darkprimary focus:outline-none 
                       transition-all duration-300"
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 text-lg font-bold text-white 
                         rounded-lg shadow-lg hover:opacity-90 transition-all 
             duration-300 transform hover:scale-105"
        style={{ backgroundColor: "rgb(59, 130, 100)" }} // Tailwind's `primary` equivalent in RGB
      >
        {parent === "signup" ? "Sign Up" : "Log In"}
      </button>
    </form>
  );
}

export default Form;
