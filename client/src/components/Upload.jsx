import React, { useState } from "react";
import axios from "axios";
import { FaRegPlusSquare } from "react-icons/fa"; // plus icon for uploading pics
import { ClipLoader, MoonLoader } from "react-spinners";
import UploadPopup from "./UploadPopup";

function Upload({ setRefreshFeed, setRefreshUploads }) {
  console.log("Upload component: setRefreshFeed =", setRefreshFeed);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // pop-up modal to upload pictures

  // File selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log("YIKES", selectedFile);

    if (selectedFile && !selectedFile.type.startsWith("image/")) {
      setMessage("Only image files (JPG, PNG, GIF) are allowed.");
      setFile(null);
      return;
    }
    // Set file and clear previous message
    setFile(selectedFile);
    setMessage(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select an image to upload.");
      return;
    }
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    if (!token) {
      setMessage("User is not authenticated.");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    // Set "Uploading..." state
    setUploading(true);
    setMessage("Uploading...");

    try {
      const uploadUrl = "https://food-celebrator.onrender.com/api/upload";
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Send the token in the request header
        },
      });

      // Console log the detailed messages array from the response
      if (response.data.logs) {
        console.log("Upload logs:", response.data.logs);
      }

      // Show success message and hide the popup
      setMessage(response.data.message);
      setShowPopup(false);
      // setRefreshFeed((prev) => !prev);
      if (typeof setRefreshFeed === "function") {
        setRefreshFeed((prev) => !prev); //feed refresh
      }

      if (typeof setRefreshUploads === "function") {
        setRefreshUploads((prev) => !prev); //  userUploads refresh
      }
    } catch (error) {
      // If error response contains logs, console log them
      if (error.response && error.response.data && error.response.data.logs) {
        console.log("Upload error logs:", error.response.data.logs);
        setMessage(error.response.data.error);
      } else {
        setMessage("File upload failed.");
      }
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const contentToShow = (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      onClick={() => setShowPopup(false)}
    >
      <div
        className="bg-muted dark:bg-darkmuted p-6 rounded-lg shadow-lg text-center w-96 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Upload your photo</h2>
        <h3 className="mb-4">
          Photos must be of food, utensils, food containers, and table
          garnishes. People and other objects are not allowed.
        </h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-2 w-full border p-2 file:font-bold"
        />
        <input
          type="text"
          placeholder="Enter a caption for your photo"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="mb-4 w-full border p-2 text-white"
        />
        <div className="flex justify-center gap-4">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex justify-center items-center"
          >
            {uploading ? (
              <MoonLoader speedMultiplier={1.25} size={20} color="#fff" />
            ) : (
              "Upload"
            )}
          </button>
          <button
            onClick={() => setShowPopup(false)}
            disabled={uploading}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Cancel
          </button>
        </div>
        {message && <p className="mt-4 text-primary">{message}</p>}
      </div>
    </div>
  );
  return (
    <div className="flex items-center justify-center min-h-[100px]">
      <button
        onClick={() => setShowPopup(true)}
        className="flex items-center gap-2 px-4 py-2 text-lg border border-gray-300 
             rounded-md transition shadow-md 
             w-full md:w-auto whitespace-nowrap
             bg-white text-gray-900 dark:bg-gray-700 dark:text-white
             hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white"
      >
        <FaRegPlusSquare className="text-2xl" />
        Upload your photo!
      </button>
      <UploadPopup show={showPopup} onClose={() => setShowPopup(false)}>
        {contentToShow}
      </UploadPopup>
    </div>
  );
}

export default Upload;
