import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserUploads from "../components/UserUploads";
import ProfilePicture from "../components/ProfilePictures/ProfilePicture";
import Upload from "../components/Upload";

function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPicture, setSelectedPicture] = useState("/basedlogo.png");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // 🔥 New state for Edit Mode

  const navigate = useNavigate();
  localStorage.userId = user?.id || "";
  console.log(user);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    async function fetchUserData() {
      try {
        const response = await axios.get("http://localhost:3000/api/auth/me", {
          headers: { Authorization: token },
        });
        setUser(response.data);
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
            />
          )}
        </div>

        {/* Username */}
        <h3 className="mt-4 text-3xl font-bold text-primary dark:text-darkprimary tracking-wide">
          {user?.username.toUpperCase()}
        </h3>

        {/* Profile Info */}
        <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
          Welcome back, {user?.username.toUpperCase()}!
        </p>

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
        <div>
          <Upload />
        </div>
        <UserUploads user={user} isEditMode={isEditMode} />{" "}
        {/* 🔥 Pass edit mode to UserUploads */}
      </div>
    </div>
  );
}

export default Account;
