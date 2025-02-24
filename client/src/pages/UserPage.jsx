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
        const response = await axios.get(
          `${URL}/username/${username}/pictures`
        );
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
    <div className="min-h-screen backgroundcolor text-font dark:text-darkfont flex flex-col items-center px-6 py-16 md:py-20 animate-fadeIn">
      {/* Profile Section */}
      <div className="bg-muted dark:bg-darkmuted shadow-xl rounded-xl p-8 w-full max-w-3xl text-center flex flex-col items-center border border-gray-200 dark:border-gray-600">
        {/* Profile Avatar */}
        <div className="relative">
          <img
            src="/default-avatar.png"
            alt="User Avatar"
            className="w-28 h-28 rounded-full border-4 border-primary dark:border-darkprimary shadow-lg"
          />
        </div>

        {/* Username */}
        <h3 className="mt-4 text-3xl font-bold text-primary dark:text-darkprimary tracking-wide">
          @{username}
        </h3>

        {/* User Upload Count */}
        <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
          {userData.length > 0
            ? `${userData.length} uploads`
            : "No uploads yet"}
        </p>
      </div>

      {/* User Uploads Section */}
      <div className="w-full max-w-3xl mt-10">
        {loading ? (
          <p className="text-center text-gray-400">Loading user profile...</p>
        ) : userData.length === 0 ? (
          <p className="text-center text-red-500">
            No uploads yet for @{username}.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {userData.map((post) => (
              <div
                key={post.picture_id}
                className="relative overflow-hidden rounded-lg shadow-lg group"
              >
                {/* Image */}
                <img
                  src={post.picture_url}
                  alt={post.picture_caption || "User Upload"}
                  className="w-full h-auto object-cover rounded-lg border-2 border-gray-700 transform transition-transform duration-300 group-hover:scale-105"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-3xl">💬</span>
                </div>

                {/* Caption & Info */}
                <div className="mt-2 p-4 bg-muted dark:bg-darkmuted rounded-lg shadow-md">
                  <p className="text-gray-300 text-sm truncate">
                    {post.picture_caption || "No caption provided."}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Uploaded on{" "}
                    {new Date(post.picture_createdat).toLocaleDateString()}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserPage;
