import React, { useState } from "react";
import Upload from "../components/Upload";
import PictureFeed from "../components/PictureFeed";
import Search from "../components/Search";

function Feed() {
  return (
    <div className="min-h-screen bg-background text-primary dark:bg-darkbackground dark:text-darkprimary flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-primary dark:text-darkprimary mb-6">
        Community Feed
      </h1>

      <div className="w-full max-w-2xl">
        <PictureFeed />
      </div>
      <Upload />
      <Search />
    </div>
  );
}

export default Feed;
