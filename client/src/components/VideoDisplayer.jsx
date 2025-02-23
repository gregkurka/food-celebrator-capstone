import React from "react";

function VideoDisplayer() {
  return (
    <div className="flex justify-center items-center w-full max-w-3xl p-4 bg-black rounded-lg shadow-lg">
      <video controls autoPlay loop muted className="w-full h-auto rounded-lg">
        <source src="/IntroVideoNoSound.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoDisplayer;
