import React, { useEffect, useState } from "react";
import GetPictureByUser from "./ApiCalls/GetPictureByUser";

function UserUploads({ user }) {
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserPictures = async () => {
      try {
        const data = await GetPictureByUser(user.id);
        // Sort images by `created_at` (most recent first)
        const sortedData = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setUserPosts(sortedData);
      } catch (error) {
        console.error("Failed to fetch user uploads:", error);
      }
    };

    fetchUserPictures();
  }, [user.id]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h3 className="text-2xl font-bold mb-6">Your Picture Uploads</h3>

      {userPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg gap-3">
          {userPosts.map((post) => (
            <div
              key={post.id}
              className="relative group overflow-hidden rounded-lg shadow-md"
            >
              <img
                src={post.url}
                alt={post.caption || "User Upload"}
                className="w-full h-auto md:h-64 object-cover rounded-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm">
                  {post.caption || "No caption provided."}
                </p>
                <p className="text-gray-300 text-xs">
                  Uploaded on {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No uploads yet. Try uploading a picture!
        </p>
      )}
    </div>
  );
}

export default UserUploads;
