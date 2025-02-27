import React, { useState, useEffect } from "react";
import axios from "axios";

const URL = "https://food-celebrator.onrender.com/api";

const Likes = ({ post, setPosts, user }) => {
  const [hasLiked, setHasLiked] = useState(post?.hasLiked || false);
  const [likeId, setLikeId] = useState(post?.likeId || null);
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);

  // Ensure user is properly retrieved
  const currentUser = user?.id || localStorage.getItem("userId");

  useEffect(() => {
    if (!post || !post.picture_id || !currentUser) return;

    const fetchLikeData = async () => {
      try {
        const response = await axios.get(`${URL}/${post.picture_id}/likes`);
        setLikesCount(response.data.length);

        const userLike = response.data.find(
          (like) => like.user_id == currentUser // Ensure type consistency
        );

        if (userLike) {
          setHasLiked(true);
          setLikeId(userLike.like_id);
        } else {
          setHasLiked(false);
          setLikeId(null);
        }
      } catch (err) {
        console.error("Error fetching like data:", err);
      }
    };

    fetchLikeData();
  }, [post.picture_id, currentUser]);

  const handleLikeToggle = async () => {
    if (!currentUser || !post) return;

    try {
      if (!hasLiked) {
        console.log("two - has liked true");
        setLikesCount((prev) => prev + 1);

        setHasLiked(true);

        const response = await axios.post(`${URL}/createLike`, {
          user_id: currentUser,
          picture_id: post.picture_id,
        });

        console.log("response:", response);
        console.log("Like added:", response.data);
        console.log(response.data.like.id); //logs out the likeId
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

        const response = await axios.delete(`${URL}/deleteLike`, {
          data: { like_id: likeId },
        });
        console.log("delete", response);
        console.log("delete", response.data);

        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.picture_id === post.picture_id
              ? { ...p, hasLiked: false, likeId: null }
              : p
          )
        );

        setLikeId(null);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
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
