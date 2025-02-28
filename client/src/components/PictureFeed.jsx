import React, { useState, useEffect } from "react";
import GetFeedAll from "./ApiCalls/GetFeedAll";
import { Link } from "react-router-dom";
import PicturePopup from "./PicturePopup";
import SinglePhotoView from "./SinglePhotoView";
import Likes from "./Likes";

function PictureFeed({ user, refreshFeed }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    console.log("fetching new feed data");
    const fetchData = async () => {
      try {
        const data = await GetFeedAll();
        const sortedPosts = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setPosts(sortedPosts);
        console.log("Updated Posts:", sortedPosts);
      } catch (error) {
        console.error("Failed to fetch feed data:", error);
      }
    };

    fetchData();
  }, [refreshFeed]);

  return (
    <div className="flex flex-col items-center space-y-8">
      {posts.map((post, index) => (
        <div key={index} className="w-full max-w-lg">
          {/* User Info */}
          <div className="flex items-center space-x-2 px-2">
            <img
              src={post.profilePic || "/1.png"}
              alt={`${post.username}'s profile`}
              className="w-8 h-8 rounded-full border"
            />
            <Link
              to={`/user/${post.username}`}
              className="text-sm font-semibold hover:underline"
            >
              {post.username}
            </Link>
          </div>
          {/* Image Wrapper (Ensures Overlay Stays Only on Image) */}
          <div className="relative mt-2 group">
            <img
              src={post.url}
              alt={post.caption}
              className="w-full rounded-lg object-cover"
            />

            {/* Translucent Hover Overlay (Triggers Comment Modal) */}
            <div
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg cursor-pointer"
              onClick={() => setSelectedPost(post)} // Open comment modal
            >
              <div className="text-gray-900 px-4 py-2 rounded-lg flex items-center shadow-lg">
                <span className="text-4xl">💬</span>
              </div>
            </div>
          </div>
          {/* Caption & Upload Date */}
          {post.caption && (
            <p className="px-2 text-sm text-font dark:text-darkfont mt-2">
              <span className="font-semibold">{post.username}</span>{" "}
              {post.caption}
            </p>
          )}
          <p className="px-2 text-xs text-font dark:text-darkfont">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
          {/* Actions: Like & Comment */}
          <div className="mt-4 flex space-x-6">
            <Likes post={post} setPosts={setPosts} user={user} />

            {/* Comment Button (Also Opens Comments) */}
            <button
              className="text-2xl text-blue-400 hover:text-blue-300 transition"
              onClick={() => setSelectedPost(post)}
            >
              💬
            </button>
          </div>
        </div>
      ))}

      {/* Full Image Popup (Comment Section Included) */}
      {selectedPost && (
        <PicturePopup
          show={!!selectedPost}
          onClose={() => setSelectedPost(null)}
        >
          <SinglePhotoView
            photoId={selectedPost.picture_id}
            username={selectedPost.username}
            setIsOpen={() => setSelectedPost(null)}
          />
        </PicturePopup>
      )}
    </div>
  );
}

export default PictureFeed;
