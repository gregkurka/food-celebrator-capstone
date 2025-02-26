import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SinglePhotoView({
  photoId,
  uploadUserId,
  setIsOpen,
  picture,
}) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);

  const API_URL = "https://food-celebrator.onrender.com/api";

  // Fetch comments when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: commentsData } = await axios.get(
          `${API_URL}/${photoId}/comments`
        );
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [photoId]);

  // Handle new comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setPosting(true);
    try {
      const response = await axios.post(`${API_URL}/createComment`, {
        user_id: uploadUserId, // Ensure this is correct
        picture_id: photoId, // Ensure the photoId is being passed
        content: newComment,
      });

      // Update comments list with the new comment immediately
      setComments((prevComments) => [response.data, ...prevComments]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setPosting(false);
    }
  };

  if (!picture)
    return <p className="text-center text-red-500">Image not found.</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
      {/* Ensure the image displays properly */}
      <div className="max-h-[500px] max-w-full overflow-hidden flex justify-center items-center">
        <img
          src={picture}
          alt="User Upload"
          className="w-full h-full object-cover"
          style={{ maxHeight: "500px", maxWidth: "100%" }}
        />
      </div>

      {/* Comments Section */}
      <div className="max-h-60 overflow-y-auto p-4 space-y-3 border-t">
        {comments.map((comment) => (
          <div key={comment.id} className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">{comment.username}:</span>{" "}
            {comment.content}
          </div>
        ))}
      </div>

      {/* Comment Form */}
      <form onSubmit={handleCommentSubmit} className="p-4 border-t flex">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow p-2 border rounded-lg focus:ring focus:ring-primary dark:focus:ring-darkprimary"
        />
        <button
          type="submit"
          className="ml-2 px-6 py-3 text-lg font-semibold rounded-lg shadow-lg transition 
             bg-primary text-white border border-primary hover:bg-primary/80 
             dark:bg-darkprimary dark:border-darkprimary dark:hover:bg-darkprimary/80"
          disabled={posting}
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}
