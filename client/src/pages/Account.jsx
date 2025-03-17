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
  const [isEditMode, setIsEditMode] = useState(false);
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
          { headers: { Authorization: token } }
        );
        const userData = response.data;
        setUser(userData);
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
    <div className="min-h-screen backgroundcolor text-foreground dark:text-darkforeground flex flex-col items-center px-4 py-8 md:py-12 animate-fadeIn">
      {/* Profile Section */}
      <div className="bg-muted dark:bg-darkmuted shadow rounded-lg w-full max-w-4xl p-6 md:flex md:items-center md:space-x-8 border border-gray-200 dark:border-gray-600">
        {/* Profile Picture */}
        <div className="flex-shrink-0 flex justify-center md:justify-start">
          <div className="relative">
            <img
              src={selectedPicture}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-indigo-500 dark:border-indigo-400 shadow-lg cursor-pointer transition-transform transform hover:scale-105"
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
        </div>

        {/* Profile Info */}
        <div className="mt-6 md:mt-0 flex-grow text-center md:text-left">
          <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-wide">
            {user?.username.toUpperCase()}
          </h3>
          <div className="mt-3 text-base text-gray-600 dark:text-gray-300">
            Welcome back, {user?.username}!
          </div>
          {/* Profile Bio */}
          <div className="mt-4">
            <ProfileBio
              user={user}
              isEditMode={isEditMode}
              extraClass={isEditMode ? "text-xl" : "text-base"}
            />
          </div>
          {/* Edit Mode Button */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`mt-4 px-5 py-2 rounded-lg font-medium transition-colors ${
              isEditMode
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isEditMode ? "Exit Edit Mode" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* User Uploads Section */}
      <div className="w-full max-w-4xl mt-10 space-y-8">
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
