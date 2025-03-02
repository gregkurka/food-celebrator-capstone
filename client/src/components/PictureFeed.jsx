import React, { useState, useEffect, useRef } from "react";
import GetFeedAll from "./ApiCalls/GetFeedAll";
import { Link } from "react-router-dom";
import PicturePopup from "./PicturePopup";
import SinglePhotoView from "./SinglePhotoView";
import Likes from "./Likes";
import profilepicArray from "./profilepicArray.js";

function PictureFeed({ user, refreshFeed }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [offset, setOffset] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const limit = 15;
  const loadMoreRef = useRef(null);

  useEffect(() => {
    console.log("Refreshing feed data...");
    const refreshFeedData = async () => {
      setIsFetching(true);
      try {
        // Reset the posts and load fresh data from the beginning (offset 0)
        const data = await GetFeedAll(limit, 0);
        setPosts(data);
        // Set offset to the number of posts fetched (assuming API returns up to 'limit' posts)
        setOffset(data.length);
      } catch (error) {
        console.error("Failed to refresh feed data:", error);
      } finally {
        setIsFetching(false);
        setIsInitialLoad(false);
      }
    };

    refreshFeedData();
  }, [refreshFeed]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          console.log("Reached bottom, loading more...");
          setIsFetching(true);
          GetFeedAll(limit, offset).then((data) => {
            if (data.length > 0) {
              setPosts((prevPosts) => [...prevPosts, ...data]);
              setOffset((prevOffset) => prevOffset + limit);
            }
            setIsFetching(false);
          });
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [offset, isFetching]);

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Show loading skeleton for initial load */}
      {isInitialLoad && posts.length === 0 ? (
        <div className="animate-pulse flex flex-col items-center space-y-4 w-full max-w-lg">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-full bg-gray-200 h-72 rounded-lg" />
          ))}
        </div>
      ) : (
        posts.map((post, index) => (
          <div
            key={index}
            className="w-full max-w-lg transition-opacity duration-500 opacity-100"
          >
            {/* User Info */}
            <div className="flex items-center space-x-2 px-2">
              <img
                src={profilepicArray[post.profile_pic_num - 1] || "/1.png"}
                alt={`${post.username}'s profile`}
                className="w-8 h-8 rounded-full border"
              />
              <Link
                to={
                  user?.username === post.username
                    ? "/account"
                    : `/user/${post.username}`
                }
                className="text-sm font-semibold hover:underline"
              >
                {post.username}
              </Link>
            </div>
            {/* Image Wrapper */}
            <div className="relative mt-2 group">
              <img
                src={post.url}
                alt={post.caption}
                className="w-full rounded-lg object-cover transition-opacity duration-500 opacity-100"
              />
              {/* Overlay for comments */}
              <div
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div className="text-gray-900 px-4 py-2 rounded-lg flex items-center shadow-lg">
                  <span className="text-4xl">💬</span>
                </div>
              </div>
            </div>
            {/* Caption & Date */}
            {post.caption && (
              <p className="px-2 text-sm text-font dark:text-darkfont mt-2">
                <span className="font-semibold">{post.username}</span>{" "}
                {post.caption}
              </p>
            )}
            <p className="px-2 text-xs text-font dark:text-darkfont">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
            {/* Actions: Like & Comment */}
            <div className="mt-4 flex space-x-6">
              <Likes post={post} setPosts={setPosts} user={user} />
              <button
                className="text-2xl text-blue-400 hover:text-blue-300 transition"
                onClick={() => setSelectedPost(post)}
              >
                💬
              </button>
            </div>
          </div>
        ))
      )}

      {/* Infinite Scroll Loader */}
      <div
        ref={loadMoreRef}
        className="h-16 w-full flex justify-center items-center"
      >
        {isFetching && <p className="text-gray-500">Loading more posts...</p>}
      </div>

      {/* Full Image Popup */}
      {selectedPost && (
        <PicturePopup
          show={!!selectedPost}
          onClose={() => setSelectedPost(null)}
        >
          <SinglePhotoView
            photoId={selectedPost.picture_id}
            username={selectedPost.username}
            setIsOpen={() => setSelectedPost(null)}
          />
        </PicturePopup>
      )}
    </div>
  );
}

export default PictureFeed;
