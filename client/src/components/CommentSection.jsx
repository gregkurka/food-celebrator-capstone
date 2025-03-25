import React, { useState } from "react";
import axios from "axios";
import Comment from "./Comment";

export default function CommentSection({ photoId, comments, setComments }) {
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);

  const API_URL = "https://food-celebrator.onrender.com/api";
  const userId = localStorage.getItem("userId");
  const storedUsername = localStorage.getItem("username") || "Anonymous";

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!userId) {
      console.error("User is not logged in.");
      return;
    }

    setPosting(true);
    try {
      await axios.post(`${API_URL}/createComment`, {
        user_id: userId,
        picture_id: photoId,
        content: newComment,
      });

      const { data: commentsData } = await axios.get(
        `${API_URL}/${photoId}/comments`
      );
      setComments(commentsData);

      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="flex flex-col lg:w-[100%] xl:w-[100%]  dark:border-gray-700 bg-white dark:bg-gray-900 h-full">
      {/* Scrollable Comments Section */}
      <div className="flex-grow overflow-y-auto  space-y-4 min-h-0">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <Comment
              key={index}
              text={comment.content}
              user={comment.username || storedUsername}
            />
          ))
        ) : (
          <p className="text-gray-500 italic text-center">No comments yet.</p>
        )}
      </div>

      {/* Fixed Input Section */}
      <form
        onSubmit={handleCommentSubmit}
        className="p-3 border-t flex items-center bg-white dark:bg-gray-900 sticky bottom-0"
      >
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          type="submit"
          className={`ml-3 text-blue-500 text-sm font-semibold transition ${
            posting ? "opacity-50 cursor-not-allowed" : "hover:text-blue-600"
          }`}
          disabled={posting}
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}
