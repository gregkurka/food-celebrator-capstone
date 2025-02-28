import React, { useRef, useEffect } from "react";

function VideoDisplayer() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = 0.3; // Set initial volume to 30%
    }
  }, []);

  const handleVolumeChange = () => {
    const video = videoRef.current;
    if (video && video.muted === false && video.volume === 0) {
      video.volume = 0.3; // Set volume to 30% when unmuted
    }
  };

  return (
    <div className="flex justify-center items-center w-full max-w-3xl p-4 bg-black rounded-lg shadow-lg">
      <video
        ref={videoRef}
        controls
        autoPlay
        loop
        muted
        className="w-full h-auto rounded-lg"
        onVolumeChange={handleVolumeChange}
      >
        <source src="/FoodCelebrator.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoDisplayer;
