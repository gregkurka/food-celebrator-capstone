import React, { useState } from "react";
import axios from "axios";
const URL = "http://localhost:3000/api";

const Likes = ({ post, setPosts, user }) => {
  const [hasLiked, setHasLiked] = useState(post.hasLiked || false);
  const [likeId, setLikeId] = useState(post.likeId || null);
  const [likesCount, setLikesCount] = useState(post.likes || 0);

  console.log(user);
  console.log(post);

  const handleLikeToggle = async () => {
    try {
      if (!hasLiked) {
        setLikesCount((prev) => prev + 1);
        setHasLiked(true);

        const response = await axios.post(`${URL}/createLike`, {
          user_id: user.id,
          picture_id: post.picture_id,
        });

        console.log("Like", response.data);
        setLikeId(response.data.like.id);

        // Update global state
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.picture_id === post.picture_id
              ? {
                  ...p,
                  likes: p.likes + 1,
                  hasLiked: true,
                  likeId: response.data.like.id,
                }
              : p
          )
        );
      } else {
        // Optimistically update UI
        setLikesCount((prev) => prev - 1);
        setHasLiked(false);

        await axios.delete(`${URL}/deleteLike`, {
          data: { like_id: likeId },
        });

        console.log("Like removed");

        // Update global state
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.picture_id === post.picture_id
              ? { ...p, likes: p.likes - 1, hasLiked: false, likeId: null }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);

      // Rollback UI update in case of an error
      setLikesCount((prev) => (hasLiked ? prev + 1 : prev - 1));
      setHasLiked(!hasLiked);
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      className={`flex items-center space-x-2 transition ${
        hasLiked
          ? "text-red-400 hover:text-red-300"
          : "text-red-400 hover:text-red-300"
      }`}
    >
      {hasLiked ? "❤️" : "♡"} <span>{likesCount}</span>
    </button>
  );
};

export default Likes;
