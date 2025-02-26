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
    <div className="mx-auto bg-white dark:bg-gray-900 shadow-xl rounded-lg w-11/12 max-w-7xl flex flex-col lg:flex-row h-[90vh] overflow-hidden">
      {console.log("PhotoDisplay props:", picture?.url, picture?.caption)};
      <PhotoDisplay url={picture?.url} caption={picture?.caption} />
      <CommentSection
        comments={comments}
        setComments={setComments}
        photoId={photoId}
      />
    </div>
  );
}
