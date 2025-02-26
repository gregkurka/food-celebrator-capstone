import React from "react";

function About() {
  return (
    <div className="min-h-screen backgroundcolor text-foreground dark:text-darkforeground flex flex-col items-center justify-center px-6 py-16 md:py-20 animate-fadeIn">
      <img
        src="/1.png"
        alt="About me"
        style={{ width: "90px", height: "90px", marginBottom: "1rem" }}
      />
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        About Us!
      </h1>
      <p className="text-lg text-center max-w-2xl text-gray-800 dark:text-gray-200">
        Welcome to the Food Celebrator! We're passionate about exploring and
        celebrating diverse cuisines from around the world. Join us on this
        culinary journey as we discover new recipes, cooking techniques, and the
        stories behind the food we love.
      </p>
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Our Mission
        </h2>
        <p className="text-lg text-gray-800 dark:text-gray-200 mt-2">
          To inspire and connect people through the love of food, fostering a
          community that appreciates the rich cultural heritage and diversity of
          global cuisines.
        </p>
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Our Vision
        </h2>
        <p className="text-lg text-gray-800 dark:text-gray-200 mt-2">
          To be the leading platform for food enthusiasts, offering a space to
          share, learn, and celebrate the art of cooking and the joy of eating.
        </p>
      </div>
    </div>
  );
}

export default About;
