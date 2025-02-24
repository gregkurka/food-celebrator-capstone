import React, { useState, useEffect } from "react";
import axios from "axios";

const URL = "http://localhost:3000/api";

const Likes = ({ post, setPosts, user }) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [likesCount, setLikesCount] = useState(0);

  //Gets all the likes data
  const fetchLikeData = async () => {
    try {
      const response = await axios.get(`${URL}/${post.picture_id}/likes`);
      setLikesCount(response.data.length); // Count total likes
      // console.log(response.data); // logs array(user_id, username, like_id, created_at)

      // Did the logged-in user liked this post?
      const userLike = response.data.find((like) => like.user_id === user.id);

      if (userLike) {
        setHasLiked(true);
        // console.log(userLike.like_id); //logs all the likeIds
        setLikeId(userLike.like_id);
      } else {
        setHasLiked(false);
        setLikeId(null);
      }
    } catch (err) {
      console.error("Error fetching like data:", err);
    }
  };

  useEffect(() => {
    fetchLikeData();
  }, [post.picture_id]);

  const handleLikeToggle = async () => {
    try {
      if (!hasLiked) {
        setLikesCount((prev) => prev + 1);
        setHasLiked(true);

        const response = await axios.post(`${URL}/createLike`, {
          user_id: user.id,
          picture_id: post.picture_id,
        });

        // console.log("Like added:", response.data);
        // console.log(response.data.like.id); //logs out the likeId
        setLikeId(response.data.like.id);

        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.picture_id === post.picture_id
              ? { ...p, hasLiked: true, likeId: response.data.like.id }
              : p
          )
        );
      } else {
        if (!likeId) {
          console.error("Can't delete — likeId is null");
          return;
        }

        setLikesCount((prev) => prev - 1);
        setHasLiked(false);

        await axios.delete(`${URL}/deleteLike`, {
          data: { like_id: likeId },
        });

        console.log("Like removed");

        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.picture_id === post.picture_id
              ? { ...p, hasLiked: false, likeId: null }
              : p
          )
        );

        // After unliking, clear stored likeId
        setLikeId(null);
      }

      fetchLikeData();
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
          : "text-gray-500 hover:text-gray-400"
      }`}
    >
      {hasLiked ? "❤️" : "♡"} <span>{likesCount}</span>
    </button>
  );
};

export default Likes;
