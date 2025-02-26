import React from "react";

export default function PhotoDisplay({ url, caption }) {
  return (
    <div className="flex-1 lg:w-2/3 flex flex-col items-center justify-center bg-black">
      <img
        src={url}
        className="max-h-full max-w-full w-auto h-auto object-contain"
        alt="Uploaded"
      />
      {caption && (
        <p className="text-white bg-black bg-opacity-50 p-2 rounded mt-2">
          {caption}
        </p>
      )}
    </div>
  );
}
