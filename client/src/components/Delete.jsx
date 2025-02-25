import React, { useState, useEffect } from "react";
import axios from "axios";
const URL = "https://food-celebrator.onrender.com/api";

function Delete({ userId, postId, onDelete }) {
  //   console.log(`Deleting post ${postId} for user ${userId}`);

  const handleDelete = async (userId, postId) => {
    console.log(postId);
    try {
      const response = await axios.delete(
        `${URL}/users/${userId}/pictures/${postId}`
      );
      const data = response.json;
      if (response.status === 200) {
        console.log("Post deleted successfully");
        onDelete(postId);
      }
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <button onClick={() => handleDelete(userId, postId)} data-id={userId}>
        Delete
      </button>
    </div>
  );
}

export default Delete;
