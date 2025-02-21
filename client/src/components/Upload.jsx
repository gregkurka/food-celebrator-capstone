import React, { useState } from "react";
import axios from "axios";
import { FaRegPlusSquare } from "react-icons/fa"; // plus icon for uploading pics

function Upload() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // pop-up modal to upload pictures

  //file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && !selectedFile.type.startsWith("image/")) {
      setMessage("Only image files (JPG, PNG, GIF) are allowed.");
      setFile(null);
      return;
    }
    // Set file and clear previous message
    setFile(selectedFile);
    setMessage(null);
  };

  // const handleUpload = async () => {
  //   if (!file) {
  //     setMessage("Please select an image to upload.");
  //     return;
  //   }
  //   //form to send image and capture
  //   const formData = new FormData();
  //   console.log(file);
  //   formData.append("file", file);
  //   formData.append("caption", caption);

  //   try {
  //     console.log("FORMDATA", formData);
  //     const uploadUrl = "http://localhost:3000/api/upload"; // changed to end point.
  //     const response = await axios.post(uploadUrl, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     //success message and close modal
  //     setMessage(response.data.message);
  //     setShowPopup(false);
  //   } catch (error) {
  //     setMessage("File upload failed.");
  //     console.error(error);
  //   }
  // };

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
    try {
      const uploadUrl = "http://localhost:3000/api/upload";
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Send the token in the request header
        },
      });
      setMessage(response.data.message);
      setShowPopup(false);
    } catch (error) {
      setMessage("File upload failed.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={() => setShowPopup(true)}
        className="flex items-center gap-1 p-2 text-lg border border-gray-300 rounded-md hover:bg-gray-100 transition mt-5"
      >
        <FaRegPlusSquare /> Upload your photo!
      </button>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96 text-black">
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
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Upload
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
            {message && <p className="mt-4 text-red-500">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Upload;
