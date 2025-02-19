import React, { useState } from "react";
import Upload from "../components/Upload";
import PictureFeed from "../components/PictureFeed";

function Feed() {
  // Sample posts data (replace with API data later)
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: "johndoe",
      avatar: "https://i.pravatar.cc/150?img=1",
      content: "Loving the sunny weather today! ☀️",
      likes: 12,
      comments: 3,
    },
    {
      id: 2,
      username: "janesmith",
      avatar: "https://i.pravatar.cc/150?img=2",
      content: "Just finished my latest painting 🎨",
      likes: 30,
      comments: 5,
    },
    {
      id: 3,
      username: "mikelee",
      avatar: "https://i.pravatar.cc/150?img=3",
      content: "Hiking adventures in the mountains! ⛰️",
      likes: 24,
      comments: 8,
    },
  ]);

  // Function to handle likes
  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Community Feed</h1>

      <div className="w-full max-w-2xl space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            {/* User Info */}
            <div className="flex items-center space-x-4">
              <img
                src={post.avatar}
                alt={post.username}
                className="w-12 h-12 rounded-full border-2 border-green-400"
              />
              <h2 className="text-lg font-semibold">{post.username}</h2>
            </div>

            {/* Post Content */}
            <p className="mt-4 text-gray-300">{post.content}</p>

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

export default Feed;
