import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import MobileUpload from "./MobileUpload";

function MobileBottomBar({ setRefreshFeed, setRefreshUploads }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      {/* Upload Button (Prominent Center) */}
      <div
        className="fixed bottom-0 left-0 w-full
        bg-background/80 dark:bg-darkbackground/80 
        backdrop-blur-md shadow-lg text-foreground dark:text-darkforeground 
        border-gray-300 dark:border-gray-700 
        flex justify-around items-center py-3 md:hidden"
      ></div>

      {/* Upload Popup - Fixed at Bottom */}
      {showPopup && (
        <div className="fixed bottom-0 left-0 w-full bg-opacity-0 dark:bg-opacity-0 shadow-lg translate-y-9 z-50">
          <MobileUpload
            setRefreshFeed={setRefreshFeed}
            setRefreshUploads={setRefreshUploads}
            showPopup={showPopup}
            setShowPopup={setShowPopup}
          />
        </div>
      )}
    </>
  );
}

export default MobileBottomBar;
