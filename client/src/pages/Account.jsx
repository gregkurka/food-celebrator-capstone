import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserUploads from "../components/UserUploads";
import ProfilePicture from "../components/ProfilePictures/ProfilePicture";

function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controls visibility of the selection menu
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false); // Ensure loading is false before redirect
      console.log(token);
      // navigate("/login");
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
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          My Account
        </h2>
        <div className="flex flex-col items-center">
          {/* Clicking the profile picture toggles the selection menu */}
          <img
            src={selectedPicture}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-300 shadow-sm cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          <h3 className="mt-4 text-xl font-medium text-gray-900">
            {user?.username}
          </h3>

          {/* Show profile picture selection menu only if isMenuOpen is true */}
          {isMenuOpen && (
            <ProfilePicture
              selectedPicture={selectedPicture}
              setSelectedPicture={(picture) => {
                setSelectedPicture(picture);
                setIsMenuOpen(false); // Close menu after selection
              }}
            />
          )}
        </div>
      </div>
      <UserUploads user={user} />
    </div>
  );
}

export default Account;
