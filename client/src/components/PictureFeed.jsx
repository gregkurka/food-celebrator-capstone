import React, { useState, useEffect } from "react";
import GetFeedAll from "./ApiCalls/GetFeedAll";
import { Link } from "react-router-dom";
import PicturePopup from "./PicturePopup";
import SinglePhotoView from "./SinglePhotoView";
import Likes from "./Likes";

function PictureFeed({ user }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetFeedAll();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch feed data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-8">
      {posts.map((post) => (
        <div key={post.id} className="w-full max-w-lg">
          {/* User Info */}
          <div className="flex items-center space-x-2 px-2">
            <img
              src={post.profilePic || "/default-avatar.png"}
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
            {/* Image (No Scaling on Hover) */}
            <div className="relative">
              <img
                onClick={() => setSelectedPost(post)}
                src={post.url}
                alt={post.caption}
                className="w-full rounded-lg object-cover"
              />

              {/* Translucent Hover Overlay (Only Covers Image) */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <div className="bg-white/80 text-gray-900 px-4 py-2 rounded-lg flex items-center shadow-lg backdrop-blur-md">
                  <span className="text-2xl">💬</span>
                </div>
              </div>
            </div>
          </div>

          {/* Caption & Upload Date */}
          {post.caption && (
            <p className="px-2 text-sm text-foreground dark:text-darkforeground mt-2">
              <span className="font-semibold">{post.username}</span>{" "}
              {post.caption}
            </p>
          )}
          <p className="px-2 text-xs text-muted dark:text-darkmuted">
            {new Date(post.created_at).toLocaleDateString()}
          </p>

          {/* Actions: Like & Comment */}
          <div className="mt-4 flex space-x-6">
            <Likes post={post} setPosts={setPosts} user={user} />

            {/* Enlarged Comment Bubble */}
            <button className="text-2xl text-blue-400 hover:text-blue-300 transition">
              💬
            </button>
          </div>

          {/* Full Image Popup */}
          {selectedPost && (
            <PicturePopup
              show={!!selectedPost}
              onClose={() => setSelectedPost(null)}
            >
              <SinglePhotoView
                picture={selectedPost.url}
                photoId={selectedPost.picture_id}
                uploadUserId={selectedPost.user_id}
                setIsOpen={() => setSelectedPost(null)}
              />
            </PicturePopup>
          )}
        </div>
      ))}
    </div>
  );
}

export default PictureFeed;
