import React, { useEffect, useState } from "react";
import GetPictureByUser from "./ApiCalls/GetPictureByUser";
import Delete from "./Delete";
import SinglePhotoView from "./SinglePhotoView";
import PicturePopup from "./PicturePopup";

function UserUploads({ user, isEditMode, refreshUploads }) {
  const [userPosts, setUserPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchUserPictures = async () => {
      try {
        const data = await GetPictureByUser(user.id);
        // Sort images by `created_at` (most recent first)
        const sortedData = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        console.log("line15", sortedData); //gives id, url, caption, created_at from picture table
        setUserPosts(sortedData);
      } catch (error) {
        console.error("Failed to fetch user uploads:", error);
      }
    };

    fetchUserPictures();
  }, [user.id, refreshUploads]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h3 className="text-2xl font-bold mb-6">Your Picture Uploads</h3>

      {userPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userPosts.map((post) => (
            <div key={post.id} className="flex flex-col items-center">
              {/* Image Container */}
              <div className="relative group overflow-hidden rounded-lg shadow-md w-full">
                <img
                  src={post.url}
                  alt={post.caption || "User Upload"}
                  className="w-full h-auto md:h-64 object-cover rounded-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105 cursor-pointer"
                  onClick={() => setSelectedPost(post)}
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

              {/* Delete Button (Below Image) */}
              {isEditMode && (
                <div className="mt-4 px-4 py-2 text-white font-semibold rounded-lg transition bg-red-500 hover:bg-red-600">
                  <Delete
                    userId={user.id}
                    postId={post.id}
                    onDelete={(deletedPostId) => {
                      setUserPosts((prevUserPosts) =>
                        prevUserPosts.filter(
                          (post) => post.id !== deletedPostId
                        )
                      );
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No uploads yet. Try uploading a picture!
        </p>
      )}

      {/* Full Image Popup (Comment Section Included) */}
      {selectedPost && (
        <PicturePopup
          show={!!selectedPost}
          onClose={() => setSelectedPost(null)}
        >
          <SinglePhotoView
            photoId={selectedPost.id}
            username={user.username}
            setIsOpen={() => setSelectedPost(null)}
          />
        </PicturePopup>
      )}
    </div>
  );
}

export default UserUploads;
