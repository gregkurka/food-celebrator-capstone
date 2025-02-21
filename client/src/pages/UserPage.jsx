import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import UserUploads from "../components/UserUploads";

function UserPage() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/username/${username}/pictures`
        );
        const data = await response.json();
        console.log(data);
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) return <p className="text-center">Loading user profile...</p>;
  if (!userData)
    return <p className="text-center text-red-500">User not found.</p>;

  return (
    <div>
      <h3>UserPage</h3>
      {/* <UserUploads user={user} /> */}
      {/* need to edit out, and put new export here */}
      <p>{userData.username}</p>
    </div>
  );
}

export default UserPage;
