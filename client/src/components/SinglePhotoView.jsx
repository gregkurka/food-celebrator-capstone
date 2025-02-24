import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SinglePhotoView({ photoId, setIsOpen, picture }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);

  const API_URL = "https://food-celebrator.onrender.com/api";// Adjust as needed
  const userId = localStorage.getItem("userId"); // Get userId from localStorage

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: commentsData } = await axios.get(
          `${API_URL}/${photoId}/comments`
        );
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [photoId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Ensure userId exists before making the request
    if (!userId) {
      console.error("User is not logged in.");
      return;
    }

    setPosting(true);
    try {
      const response = await axios.post(`${API_URL}/createComment`, {
        user_id: userId, // Use stored userId
        picture_id: photoId,
        content: newComment,
      });

      if (response.data) {
        setComments((prevComments) => [response.data, ...prevComments]); // Ensure proper state update
      }
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (!picture)
    return <p className="text-center text-red-500">Photo not found.</p>;

  return (
    <div
      className="mx-auto bg-white dark:bg-gray-900 shadow-xl rounded-lg overflow-hidden 
                 w-11/12 max-w-md md:max-w-lg lg:max-w-3xl xl:max-w-5xl"
    >
      {/* Photo Section */}
      <img
        src={picture}
        className="w-full object-cover rounded-t-lg"
        alt="Uploaded"
      />

      {/* Comments Section */}
      <div className="max-h-80 overflow-y-auto p-4 space-y-3 border-t">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment.id || Math.random()} // Ensure a unique key
              text={comment.content}
              user={comment.username}
            />
          ))
        ) : (
          <p className="text-gray-500 italic">No comments yet.</p>
        )}
      </div>

      {/* Comment Form */}
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
  // Prevent crashes if text is undefined
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
