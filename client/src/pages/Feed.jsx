import React, { useState } from "react";
import Upload from "../components/Upload";
import PictureFeed from "../components/PictureFeed";

function Feed() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Community Feed</h1>

      <div className="w-full max-w-2xl">
        <PictureFeed />
      </div>
      <Upload />
    </div>
  );
}

export default Feed;
