import React, { useState } from "react";
import axios from "axios";
import { FaRegPlusSquare } from "react-icons/fa"; // plus icon for uploading pics
import PicturePopup from "./PicturePopup";

function Upload() {
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
      const uploadUrl = "http://localhost:3000/api/upload";
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
        className="bg-white p-6 rounded-lg shadow-lg text-center w-96 text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Upload your photo</h2>
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
          className="mb-4 w-full border p-2"
        />
        <div className="flex justify-center gap-4">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
          <button
            onClick={() => setShowPopup(false)}
            disabled={uploading}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Cancel
          </button>
        </div>
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
  return (
    <div className="flex items-center justify-center min-h-[100px]">
      <button
        onClick={() => setShowPopup(true)}
        className="flex items-center gap-2 px-6 py-3 text-lg border border-gray-300 
                   rounded-md hover:bg-gray-100 transition shadow-md 
                   w-full md:w-auto whitespace-nowrap"
      >
        <FaRegPlusSquare className="text-2xl" />
        Upload your photo!
      </button>
      <PicturePopup
        show={showPopup}
        onClose={setShowPopup}
        children={contentToShow}
      />
      {/* {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50"
          onClick={() => setShowPopup(false)} // Close when clicking outside
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg text-center w-96 text-black"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <h2 className="text-xl font-bold mb-4">Upload your photo</h2>
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
              className="mb-4 w-full border p-2"
            />
            <div className="flex justify-center gap-4">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
              <button
                onClick={() => setShowPopup(false)}
                disabled={uploading}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
            {message && <p className="mt-4 text-red-500">{message}</p>}
          </div>
        </div>
      )} */}
    </div>
  );
}

export default Upload;
