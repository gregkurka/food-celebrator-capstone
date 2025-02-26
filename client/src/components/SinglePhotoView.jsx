import React, { useEffect, useState } from "react";
import axios from "axios";
import PhotoDisplay from "./PhotoDisplay";
import CommentSection from "./CommentSection";

export default function SinglePhotoView({ photoId, username }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [picture, setPicture] = useState(null);
  const API_URL = "https://food-celebrator.onrender.com/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: pictureData } = await axios.get(
          `${API_URL}/username/${username}/pictures/${photoId}`
        );
        setPicture({
          url: pictureData.picture_url,
          caption: pictureData.picture_caption,
          createdAt: pictureData.picture_createdat,
        });

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
  }, [photoId, username]);

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (!picture)
    return <p className="text-center text-red-500">Photo not found.</p>;

  return (
    <div className="mx-auto bg-white dark:bg-gray-900 shadow-md rounded-lg w-full max-w-5xl flex flex-col lg:flex-row h-[90vh]">
      {/* Left Side - Photo Display */}
      <div className="flex-1 flex items-center justify-center bg-black">
        <PhotoDisplay url={picture?.url} caption={picture?.caption} />
      </div>

      {/* Right Side - Comments Section */}
      <div className="w-full lg:w-[40%] flex flex-col border-l dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="px-4 py-3 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">{username}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(picture.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <CommentSection
            comments={comments}
            setComments={setComments}
            photoId={photoId}
          />
        </div>
      </div>
    </div>
  );
}
