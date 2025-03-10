import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserUploads from "../components/UserUploads";
import ProfilePicture from "../components/ProfilePictures/ProfilePicture";
import Upload from "../components/Upload";

import ProfileBio from "../components/ProfileBio/ProfileBio";
import profilepicArray from "../components/profilepicArray.js";

function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPicture, setSelectedPicture] = useState(profilepicArray[0]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // 🔥 New state for Edit Mode
  const [refreshUploads, setRefreshUploads] = useState(false);

  const navigate = useNavigate();
  localStorage.userId = user?.id || "";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    async function fetchUserData() {
      try {
        const response = await axios.get(
          "https://food-celebrator.onrender.com/api/auth/me",
          {
            headers: { Authorization: token },
          }
        );

        const userData = response.data;
        setUser(userData);

        // Ensure profile_pic_num is within the valid index range
        if (
          userData.profile_pic_num &&
          userData.profile_pic_num > 0 &&
          userData.profile_pic_num <= profilepicArray.length
        ) {
          setSelectedPicture(profilepicArray[userData.profile_pic_num - 1]);
        }

      } catch (err) {
        setError("Failed to load user data. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [navigate]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen backgroundcolor text-foreground dark:text-darkforeground flex flex-col items-center px-6 py-16 md:py-20 animate-fadeIn">
      {/* Profile Card */}
      <div
        className="bg-muted dark:bg-darkmuted shadow-xl rounded-xl p-8 w-full max-w-3xl text-center 
            flex flex-col items-center border border-gray-200 dark:border-gray-600"
      >
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={selectedPicture}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-primary dark:border-darkprimary shadow-lg 
                       cursor-pointer transition-transform transform hover:scale-105"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          {isMenuOpen && (
            <ProfilePicture
              selectedPicture={selectedPicture}
              setSelectedPicture={(picture) => {
                setSelectedPicture(picture);
                setIsMenuOpen(false);
              }}
              username={user.username}
            />
          )}
        </div>

        {/* Username */}
        <h3 className="mt-4 text-3xl font-bold text-primary dark:text-darkprimary tracking-wide">
          {user?.username.toUpperCase()}
        </h3>

        {/* Profile Info */}
        <div className="mt-2 text-lg text-gray-700 dark:text-gray-300">
          Welcome back, {user?.username.toUpperCase()}!
          <ProfileBio user={user} isEditMode={isEditMode} />
        </div>

        {/* Edit Mode Button */}
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`mt-4 px-4 py-2 text-white font-semibold rounded-lg transition ${
            isEditMode
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </button>
      </div>

      {/* User Uploads Section */}
      <div className="w-full max-w-3xl mt-10 space-y-6">
        <div className="hidden md:flex justify-center">
          <Upload setRefreshUploads={setRefreshUploads} />
        </div>
        <UserUploads
          user={user}
          isEditMode={isEditMode}
          refreshUploads={refreshUploads}
        />
      </div>
    </div>
  );
}

export default Account;
