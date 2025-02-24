import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SinglePhotoView({
  photoId,
  uploadUserId,
  setIsOpen,
  picture,
}) {
  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);

  const API_URL = "http://localhost:3000/api"; // Adjust as needed

  // Fetch photo and comments
  useEffect(() => {
    const fetchData = async () => {
      // If we get new photo call by id delete picture from props and use this data instead: photo api call
      try {
        const { data: commentsData } = await axios.get(
          `${API_URL}/${photoId}/comments`
        );
        setPhoto(photoData);
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    // fetchData();
    setLoading(false); //Delete later. After seeding comments.
  }, [photoId]);

  // Handle new comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setPosting(true);
    try {
      const response = await axios.post(
        `${API_URL}/photos/${photoId}/comments`,
        {
          text: newComment,
        }
      );
      setComments([response.data, ...comments]); // Add new comment to the top
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setPosting(false);
    }
  };
  console.log("I AM LEG", picture);
  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (!picture)
    return <p className="text-center text-red-500">Photo not found.</p>;

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Photo Section */}
      <img src={picture} className="w-full" />

      {/* Photo Caption
      <div className="p-4">
        <p className="text-gray-800 font-semibold">{photo.caption}</p>
      </div> */}

      {/* Comments Section */}
      <div className="max-h-60 overflow-y-auto p-4 space-y-3 border-t">
        {comments.map((comment) => (
          <Comment key={comment.id} text={comment.text} user={comment.user} />
        ))}
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
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
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
  const words = text.split(" ");
  const isLong = words.length > 10;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="text-gray-700">
      <span className="font-semibold">{user}:</span>{" "}
      {isLong && !expanded ? words.slice(0, 10).join(" ") + "..." : text}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-500 ml-2"
        >
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
};
