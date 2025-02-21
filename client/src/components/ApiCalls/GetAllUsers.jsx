import React from "react";
import axios from "axios";
const URL = "http://localhost:3000/api";

async function GetAllUsers() {
  try {
    const response = await axios.get(`${URL}/users`);
    console.log(response);
    console.log(response.data);
    return response.data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default GetAllUsers;
