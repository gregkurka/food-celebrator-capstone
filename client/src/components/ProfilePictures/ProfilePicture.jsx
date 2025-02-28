import React from "react";
import axios from "axios";

const profilePictures = [
  "/1.png",
  "/5.png",
  "/6.png",
  "/7.png",
  "/8.png",
  "/9.png",
  "/10.png",
  "/11.png",
  "/12.png",
  "/13.png",
  "/14.png",
  "/15.png",
  "/16.png",
  "/17.png",
  "/18.png",
  "/19.png",
  "/21.png",
  "/22.png",
  "/23.png",
  "/24.png",
  "/25.png",
  "/26.png",
  "/27.png",
  "/28.png",
  "/29.png",
  "/30.png",
  "/31.png",
];

function ProfilePicture({ selectedPicture, setSelectedPicture, username }) {
  const handlePictureSelect = async (picture, index) => {
    setSelectedPicture(picture);

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      await axios.put(
        `https://food-celebrator.onrender.com/api/${username}/profilepic`,
        { profile_pic_num: index + 1 }, // Convert index to match DB numbering
        {
          headers: { Authorization: token },
        }
      );
    } catch (error) {
      console.error("Failed to update profile picture number", error);
    }
  };

  return (
    <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-center">
        Choose a Profile Picture
      </h3>
      <div className="overflow-y-auto max-h-60 p-2">
        <div className="grid grid-cols-3 gap-4">
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
              onClick={() => handlePictureSelect(picture, index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePicture;
