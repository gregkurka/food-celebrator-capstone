import React from "react";

const profilePictures = [
  "/coffee.png",
  "/pancakes.png",
  "/pizza.png",
  "/salad.png",
  "/steak.jpg",
];

function ProfilePicture({ selectedPicture, setSelectedPicture }) {
  return (
    <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-center">
        Choose a Profile Picture
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {profilePictures.map((picture, index) => (
          <img
            key={index}
            src={picture}
            alt={`Profile ${index + 1}`}
            className={`w-20 h-20 rounded-full cursor-pointer border-2 ${
              selectedPicture === picture
                ? "border-blue-500"
                : "border-gray-300"
            }`}
            onClick={() => setSelectedPicture(picture)}
          />
        ))}
      </div>
    </div>
  );
}

export default ProfilePicture;
