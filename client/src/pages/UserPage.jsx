import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import UserUploads from "../components/UserUploads";
const URL = "http://localhost:3000/api";

function UserPage() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${URL}/username/${username}/pictures`
        );
        console.log(response.data);
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading)
    return <p className="text-center text-gray-400">Loading user profile...</p>;
  if (!userData || userData.length === 0)
    return (
      <p className="text-center text-red-500">
        No uploads yet for @{username}.
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h3>Profile: {username}</h3>

      <div className="w-full max-w-2xl">
        {userData.map((post) => (
          <div
            key={post.picture_id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <div className="flex flex-col items-center space-y-4">
              <img
                src={post.picture_url}
                alt={post.picture_caption}
                className="w-80 h-80 sm:w-100 sm:h-100 rounded-lg border-2 border-white-400"
              />
              <p className="mt-4 text-gray-300">
                {post.picture_caption || "No caption provided."}
              </p>
            </div>
            <p className="text-gray-400 text-xs mt-2">
              Uploaded on{" "}
              {new Date(post.picture_createdat).toLocaleDateString()}
            </p>
            {/* Actions (Like & Comment) */}
            <div className="mt-4 flex space-x-6">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition"
              >
                ❤️ <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition">
                💬 <span>{post.comments}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserPage;
