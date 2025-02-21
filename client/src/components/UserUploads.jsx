import React, { useEffect, useState } from "react";
import GetPictureByUser from "./ApiCalls/GetPictureByUser";

function UserUploads({ user }) {
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserPictures = async () => {
      try {
        const data = await GetPictureByUser(user.id);
        setUserPosts(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch feed data:", error);
      }
    };

    fetchUserPictures();
  }, []);

  return (
    <div>
      <h3>Your Picture Uploads:</h3>
      <div className="space-y-6">
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <div
              key={post.id}
              className="bg-muted dark:bg-darkmuted p-6 rounded-lg shadow-lg"
            >
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={post.url}
                  alt={post.caption || "User Upload"}
                  className="w-80 h-80 sm:w-100 sm:h-100 rounded-lg border-2 border-primary"
                />
              </div>

              {/* Post Caption */}
              <p className="mt-4 text-secondary dark:text-darksecondary">
                {post.caption || "No caption provided."}
              </p>

              {/* Timestamp */}
              <p className="text-secondary dark:text-darksecondary text-sm">
                {post.created_at}
              </p>
            </div>
          ))
        ) : (
          <p className="text-secondary dark:text-darksecondary text-center">
            No uploads yet. Try uploading a picture!
          </p>
        )}
      </div>
    </div>
  );
}

export default UserUploads;
