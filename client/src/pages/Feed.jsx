import React, { useState } from "react";
import Upload from "../components/Upload";
import PictureFeed from "../components/PictureFeed";
import Search from "../components/Search";

function Feed({ user }) {
  const [refreshFeed, setRefreshFeed] = useState(false);
  console.log("refreshfeed", refreshFeed); //logs as false

  return (
    <div
      className="backgroundcolor text-font dark:text-darkfont 
                 flex flex-col items-center px-6 py-6 md:py-16"
    >
      {/* Page Title */}
      <h1
        className="text-5xl md:text-6xl font-extrabold tracking-wide 
             text-font dark:text-darkfont 
             my-8 text-center animate-fadeIn"
      >
        Taste Feed
      </h1>

      {/* Search Bar & Upload Button - Left-Aligned Search Bar */}
      <div className="w-full max-w-3xl flex flex-col items-center">
        {/* Search Bar (Shifted Left) */}
        <div className="w-full md:flex-1 flex self-start">
          <Search />
        </div>

        {/* Upload Button (Remains Right-Aligned) */}
        <div className="hidden md:flex w-full md:w-auto flex items-center justify-center">
          <Upload setRefreshFeed={setRefreshFeed} />
        </div>
      </div>

      {/* Picture Feed Section with Hover Effects */}
      <div className="w-full max-w-3xl mt-8 space-y-6">
        <PictureFeed user={user} refreshFeed={refreshFeed} />
      </div>
    </div>
  );
}

export default Feed;
