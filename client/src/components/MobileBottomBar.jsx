import React from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import Upload from "./Upload";

function MobileBottomBar({ onUploadClick }) {
  return (
    <div
      className="fixed bottom-0 left-0 w-full
      bg-background/80 dark:bg-darkbackground/80 
      backdrop-blur-md shadow-lg text-foreground dark:text-darkforeground 
      border-gray-300 dark:border-gray-700 
      shadow-md flex justify-around items-center py-3 md:hidden"
    >
      {/* Upload Button (Prominent Center) */}
      <div
        onClick={onUploadClick}
        className="w-18 h-9 bg-primary dark:bg-darkprimary text-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition fixed bottom-50"
      >
        <Upload />
      </div>
    </div>
  );
}

export default MobileBottomBar;
