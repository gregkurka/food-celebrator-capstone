import React from "react";
import axios from "axios";
const URL = "https://food-celebrator.onrender.com/api";

async function GetAllUsers() {
  try {
    const response = await axios.get(`${URL}/users`);
    return response.data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default GetAllUsers;
