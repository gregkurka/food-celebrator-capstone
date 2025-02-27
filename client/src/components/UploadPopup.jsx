import React from "react";

function UploadPopup({ show, onClose, children }) {
  if (!show) return null; // Don't render if `show` is false

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      onClick={onClose} // Close when clicking outside
    >
        <div className="max-h-[80vh] overflow-y-auto">{children}</div>
    </div>
  );
}

export default UploadPopup;
