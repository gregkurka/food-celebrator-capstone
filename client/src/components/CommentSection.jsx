import React, { useState } from "react";
import axios from "axios";

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
    <div className="flex flex-col w-full lg:w-1/3 border-l border-gray-300 dark:border-gray-700 max-h-full">
      {/* Scrollable Comments */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
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

      {/* Comment Input */}
      <form onSubmit={handleCommentSubmit} className="p-4 border-t flex">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow p-2 border rounded-lg focus:ring focus:ring-blue-200"
        />
        <button
          type="submit"
          className="ml-2 px-6 py-3 text-lg font-semibold rounded-lg shadow-lg transition 
                      bg-primary text-font border dark:text-darkfont border-primary hover:bg-primary/80 
                      dark:bg-darkprimary dark:border-darkprimary dark:hover:bg-darkprimary/80"
          disabled={posting}
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}
// Comment Component (Handles Collapsing Long Comments)
const Comment = ({ text, user }) => {
  if (!text) return <p className="text-gray-500 italic">[No content]</p>;

  const words = text.split(" ");
  const isLong = words.length > 10;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="text-gray-700 dark:text-gray-300">
      <span className="font-semibold">{user || "Anonymous"}:</span>{" "}
      {isLong && !expanded ? words.slice(0, 10).join(" ") + "..." : text}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-500 dark:text-blue-400 ml-2"
        >
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
};
