import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserUploads from "../components/UserUploads";
import ProfilePicture from "../components/ProfilePictures/ProfilePicture";

function Account() {
  // State to store user information
  const [user, setUser] = useState(null);
  // State to track loading status
  const [loading, setLoading] = useState(true);
  // State to store error messages if any occur during data fetching
  const [error, setError] = useState(null);
  // State to manage the selected profile picture, defaulting to a placeholder image
  const [selectedPicture, setSelectedPicture] = useState("/basedlogo.png");
  // State to control visibility of the profile picture selection menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hook to navigate programmatically
  const navigate = useNavigate();

  // useEffect runs when the component mounts to fetch user data
  useEffect(() => {
    // Retrieve authentication token from local storage
    const token = localStorage.getItem("token");

    // If no token is found, stop loading and prevent navigation
    if (!token) {
      setLoading(false);
      console.log(token); // Debugging statement
      // navigate("/login"); // Redirect to login page (currently commented out)
      return;
    }

    // Function to fetch user data from the API
    async function fetchUserData() {
      try {
        const response = await axios.get("http://localhost:3000/api/auth/me", {
          headers: { Authorization: token },
        });
        setUser(response.data); // Store user data in state
        // setSelectedPicture(response.data.profilePicture || "/basedlogo.png"); // Set profile picture if available (commented out)
      } catch (err) {
        setError("Failed to load user data. Please log in again.");
        localStorage.removeItem("token"); // Remove invalid token
        navigate("/login"); // Redirect to login page
      } finally {
        setLoading(false); // End loading state
      }
    }

    fetchUserData(); // Call function to fetch data
  }, [navigate]); // Dependency array ensures effect runs only when component mounts

  // Display loading message while fetching data
  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  // Display error message if data fetching fails
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center p-6 bg-background dark:bg-darkbackground min-h-screen">
      <div className="bg-muted dark:bg-darkmuted shadow-lg rounded-xl p-6 w-full max-w-md">
        {/* Page title */}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          My Account
        </h2>

        <div className="flex flex-col items-center">
          {/* Profile picture, clicking it toggles the selection menu */}
          <img
            src={selectedPicture}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-300 shadow-sm cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />

          {/* Display username in uppercase */}
          <h3 className="mt-4 text-xl font-medium text-gray-900">
            {user?.username.toUpperCase()}
          </h3>

          {/* Profile picture selection menu, shown only when isMenuOpen is true */}
          {isMenuOpen && (
            <ProfilePicture
              selectedPicture={selectedPicture}
              setSelectedPicture={(picture) => {
                setSelectedPicture(picture); // Update selected picture
                setIsMenuOpen(false); // Close menu after selection
              }}
            />
          )}
        </div>
      </div>

      {/* Component to display user-uploaded content */}
      <UserUploads user={user} />
    </div>
  );
}

export default Account;
