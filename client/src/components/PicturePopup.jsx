import React from "react";

function PicturePopup({ show, onClose, children }) {
  if (!show) return null; // Don't render if `show` is false

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
      onClick={onClose} // Close when clicking outside
    >
      <div
        className="bg-transpa dark:bg-gray-900 p-6 rounded-xl shadow-xl text-center 
                   
                   text-gray-900 dark:text-gray-100
                   w-11/12 max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Popup Content */}
        {/* <div className="space-y-4">{children}</div> */}
        <div>{children}</div>
        {/* ✅ Removed `space-y-4` */}
        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 px-6 py-3 font-semibold rounded-lg shadow-md transition 
                     border border-gray-400 dark:border-gray-600
                     bg-primary text-white dark:bg-darkprimary dark:text-white 
                     hover:bg-opacity-80 dark:hover:bg-opacity-80"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default PicturePopup;
