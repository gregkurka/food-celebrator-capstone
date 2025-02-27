import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VideoDisplayer from "../components/VideoDisplayer";

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const images = [
    "/demophotos/picture1.png",
    "/demophotos/picture2.png",
    "/demophotos/picture3.png",
    "/demophotos/picture4.png",
    "/demophotos/picture5.png",
  ];

  const [currentImage, setCurrentImage] = useState(images[0]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % images.length;
      setCurrentImage(images[index]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center 
                 px-4 py-8 sm:py-12 md:py-16 lg:py-20 transition-all duration-700"
      style={{
        backgroundImage: `url(${currentImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Container for content with responsive width */}
      <div
        className="flex flex-col items-center w-full max-w-lg sm:max-w-xl md:max-w-4xl 
                      bg-white/80 dark:bg-gray-800/70 p-6 sm:p-8 rounded-xl shadow-md backdrop-blur-lg"
      >
        {/* Title with dynamic text sizes */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide 
                     text-font dark:text-darkfont my-6 sm:my-8 text-center animate-fadeIn"
        >
          FOOD CELEBRATOR
        </h1>

        {/* Video Component */}
        <div className="w-full max-w-lg sm:max-w-2xl mt-6 flex justify-center">
          <VideoDisplayer />
        </div>

        <h2 className="text-lg sm:text-xl mt-4 sm:mt-6 text-font dark:text-darkfont">
          Savor Every Bite, Celebrate Every Flavor!
        </h2>

        {/* Conditional Buttons - Wrap on small screens */}
        <div
          className="flex flex-col sm:flex-row justify-center items-center 
             space-y-4 sm:space-y-0 sm:space-x-4 mt-8 w-full"
        >
          {isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/feed")}
                className="px-6 sm:px-8 py-3 sm:py-4 text-lg font-semibold rounded-xl 
                   transition-all duration-300 w-full sm:w-48 buttongradients"
              >
                Feed
              </button>
              <button
                onClick={() => navigate("/account")}
                className="px-6 sm:px-8 py-3 sm:py-4 text-lg font-semibold rounded-xl 
                   transition-all duration-300 w-full sm:w-48 buttongradients"
              >
                Account
              </button>
              <button
                onClick={() => navigate("/recipes")}
                className="px-6 sm:px-8 py-3 sm:py-4 text-lg font-semibold rounded-xl 
                   transition-all duration-300 w-full sm:w-48 buttongradients"
              >
                Recipes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/signup")}
                className="px-6 sm:px-8 py-3 sm:py-4 text-lg font-semibold rounded-xl 
                   transition-all duration-300 w-full sm:w-48 buttongradients"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-6 sm:px-8 py-3 sm:py-4 text-lg font-semibold rounded-xl 
                   transition-all duration-300 w-full sm:w-48 buttongradients"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
