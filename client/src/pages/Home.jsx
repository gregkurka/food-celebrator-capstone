import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VideoDisplayer from "../components/VideoDisplayer";

function Home() {
  const navigate = useNavigate();

  const images = [
    "/basedlogo.png",
    "/coffee.png",
    "/pancakes.png",
    "/pizza.png",
    "/salad.png",
    "/steak.jpg",
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
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-16 md:py-20 bg-cover bg-center transition-all duration-700"
      style={{
        backgroundImage: `url(${currentImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col items-center w-full max-w-4xl bg-white/80 dark:bg-gray-800/70 p-6 rounded-xl shadow-md backdrop-blur-lg">
        <h1 className="text-5xl font-bold text-primary dark:text-darkprimary tracking-tight">
          FOOD CELEBRATOR
        </h1>

        {/* Video Component */}
        <div className="w-full max-w-3xl mt-8 flex justify-center">
          <VideoDisplayer />
        </div>

        <h2 className="text-2xl mt-6 text-secondary dark:text-darksecondary">
          Savor Every Bite, Celebrate Every Flavor!
        </h2>

        {/* Signup & Login Buttons */}
        <div className="flex space-x-6 mt-8">
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 dark:from-blue-400 dark:to-blue-600 dark:hover:from-blue-500 dark:hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:from-gray-700 hover:to-gray-900 dark:from-gray-500 dark:to-gray-700 dark:hover:from-gray-600 dark:hover:to-gray-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
