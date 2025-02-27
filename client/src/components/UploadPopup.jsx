import React from "react";

function UploadPopup({ show, onClose, children }) {
  if (!show) return null; // Don't render if `show` is false

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4"
      onClick={onClose} // Close when clicking outside
    >
      <div
        className="relative bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl text-center
                   text-gray-900 dark:text-gray-100
                   w-11/12 max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl
                   max-h-screen overflow-auto h-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button (X Icon) */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 
                     hover:text-gray-900 dark:hover:text-white transition"
          aria-label="Close popup"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Popup Content */}
        <div className="max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default UploadPopup;
