import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const URL = "http://localhost:3000/api";

function UserPage() {
  const { username } = useParams();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${URL}/username/${username}/pictures`);
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUserData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h3 className="text-2xl font-bold mb-6 mt-20 text-center">Profile: @{username}</h3>

      {loading ? (
        <p className="text-center text-gray-400">Loading user profile...</p>
      ) : userData.length === 0 ? (
        <p className="text-center text-red-500">No uploads yet for @{username}.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl">
          {userData.map((post) => (
            <div key={post.picture_id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <img
                src={post.picture_url}
                alt={post.picture_caption || "User Upload"}
                className="w-full h-auto object-cover rounded-lg border-2 border-gray-700"
              />
              <p className="mt-2 text-gray-300 text-sm">
                {post.picture_caption || "No caption provided."}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Uploaded on {new Date(post.picture_createdat).toLocaleDateString()}
              </p>
              <div className="mt-3 flex justify-between text-sm text-gray-400">
                <button className="flex items-center space-x-2 hover:text-green-300 transition">
                  ❤️ <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-blue-300 transition">
                  💬 <span>{post.comments}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserPage;
