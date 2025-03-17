import React, { useEffect, useState } from "react";
import GetBio from "../ApiCalls/GetBio";
import EditBio from "../ApiCalls/EditBio";

function ProfileBio({ user: { username }, isEditMode, extraClass = "" }) {
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
      const data = await EditBio(username, bio);
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
    <div className="mt-4">
      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : isEditMode ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEdit();
          }}
          className="flex flex-col space-y-2"
        >
          <textarea
            className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 ${extraClass}`}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={255}
            rows={6} // Adjust rows as needed for more space
          />
          <button
            type="submit"
            className="self-end bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            Save
          </button>
        </form>
      ) : (
        <div className="text-gray-700 dark:text-gray-300">
          <p className="text-base">{bio || "No bio available"}</p>
        </div>
      )}
      {message && <p className="mt-2 text-sm text-green-500">{message}</p>}
    </div>
  );
}

export default ProfileBio;
