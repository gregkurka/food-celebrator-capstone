import React from "react";

function PicturePopup({ show, onClose, children }) {
  if (!show) return null; // Don't render if `show` is false

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
      onClick={onClose} // Close when clicking outside
    >
      <div
        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl text-center w-96 
                   border border-gray-300 dark:border-gray-700 
                   text-gray-900 dark:text-gray-900"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {children}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 bg-primary dark:bg-darkprimary text-white 
                     px-4 py-2 rounded-lg hover:bg-opacity-80 dark:hover:bg-opacity-80 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default PicturePopup;
