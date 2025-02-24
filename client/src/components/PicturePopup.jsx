import React from "react";

function PicturePopup({ show, onClose, children }) {
  if (!show) return null; // Don't render if `show` is false

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose} // Close when clicking outside
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg text-center w-96 text-black"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {children}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
export default PicturePopup;
