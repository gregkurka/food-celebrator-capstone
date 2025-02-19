import React, { useState } from "react";
import axios from "axios";

function Upload() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Validate file type (only images)
    if (selectedFile && !selectedFile.type.startsWith("image/")) {
      setMessage("Only image files (JPG, PNG, GIF) are allowed.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);

    try {
      const uploadUrl = "YOUR_UPLOAD_URL"; // Replace with your actual upload URL
      const response = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage("File upload failed.");
      console.error(error);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>
        <strong>Upload your food celebrator picture:</strong>
      </h2>
      <input
        type="file"
        accept="image/*" // Restrict to image files only
        onChange={handleFileChange}
      />
      <input
        type="text"
        placeholder="Enter a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <button onClick={handleUpload} style={{ border: "1px solid white" }}>
        Upload
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Upload;
