import React, { useState, useEffect } from "react";
import GetFeedAll from "./ApiCalls/GetFeedAll";
import GetPictureByUser from "./ApiCalls/GetPictureByUser";
import { Link } from "react-router-dom";

function PictureFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetFeedAll();
        setPosts(data);
        console.log(post);
      } catch (error) {
        console.error("Failed to fetch feed data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to handle likes
  //   const handleLike = (postId) => {
  //     setPosts(
  //       posts.map((post) =>
  //         post.id === postId ? { ...post, likes: post.likes + 1 } : post
  //       )
  //     );
  //   };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-muted dark:bg-darkmuted p-6 rounded-lg shadow-lg"
        >
          {/* User Info */}
          <div>
            <Link
              to={`/user/${post.username}`}
              className="text-white-500 hover:underline"
            >
              {post.username}
            </Link>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <img
              src={post.url}
              alt={post.username}
              className="w-80 h-80 sm:w-100 sm:h-100 rounded-lg border-2 border-primary"
            />
            {/* <h2 className="text-lg font-semibold">{post.caption}</h2> */}
          </div>

          {/* Post Content */}
          <p className="mt-4 text-secondary">
            Uploaded on {new Date(post.created_at).toLocaleDateString()}
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
  );
}

export default PictureFeed;
