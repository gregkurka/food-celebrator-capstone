import React from "react";
import Upload from "../components/Upload";
import PictureFeed from "../components/PictureFeed";
import Search from "../components/Search";

function Feed() {
  return (
    <div
      className="min-h-screen bg-background dark:bg-darkbackground text-foreground dark:text-darkforeground 
                 flex flex-col items-center px-6 py-16 md:py-20"
    >
      {/* Page Title */}
      <h1
        className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary dark:text-darkprimary 
                   mb-6 mt-6 md:mt-10 animate-fadeIn text-center"
      >
        Community Feed
      </h1>

      {/* Search Bar & Upload Button - Left-Aligned Search Bar */}
      <div
        className="w-full max-w-3xl flex flex-col md:flex-row items-center md:items-center 
                      md:justify-between space-y-4 md:space-y-0"
      >
        {/* Search Bar (Shifted Left) */}
        <div className="w-full md:flex-1 flex self-start">
          <Search />
        </div>

        {/* Upload Button (Remains Right-Aligned) */}
        <div className="w-full md:w-auto flex items-center justify-center md:justify-end">
          <Upload />
        </div>
      </div>

      {/* Picture Feed Section */}
      <div className="w-full max-w-3xl mt-8 space-y-6">
        <PictureFeed />
      </div>
    </div>
  );
}

export default Feed;
