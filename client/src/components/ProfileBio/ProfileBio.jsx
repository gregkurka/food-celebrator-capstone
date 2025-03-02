import React, { useEffect, useState } from "react";
import GetBio from "../ApiCalls/GetBio";
import EditBio from "../ApiCalls/EditBio";

function ProfileBio({ user: { username }, isEditMode }) {
  const [bio, setBio] = useState(""); // Prevents null issues
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // === CALL BIO ===
  useEffect(() => {
    const fetchBio = async () => {
      if (!username) return;

      setLoading(true);
      try {
        const data = await GetBio(username);
        setBio(data.bio ?? ""); // Ensures it's never null
      } catch (error) {
        console.error("Failed to fetch bio data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBio();
  }, [username]);

  // === EDIT BIO ===
  const handleEdit = async () => {
    if (!bio.trim()) {
      console.warn("Cannot save an empty bio!");
      return;
    }

    setLoading(true);
    try {
      console.log("Updating bio with:", bio); // Debugging line
      const data = await EditBio(username, bio);
      console.log("Updated Bio Data from API:", data);

      setBio(data?.bio ?? bio); // Ensures bio is set correctly
      setMessage("Bio updated successfully!");
    } catch (error) {
      console.error(
        "Failed to update bio:",
        error.response?.data || error.message
      );
      setMessage("Failed to update bio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // === RENDER ===
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : isEditMode ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEdit();
          }}
        >
          <input
            className="text-font dark:text-darkfont"
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={255}
          />
          <button type="submit">Save</button>
        </form>
      ) : (
        <div>
          <p>Bio: {bio || "No bio available"}</p> {/* Handles empty bio */}
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default ProfileBio;
