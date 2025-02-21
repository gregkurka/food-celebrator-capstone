import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const URL = "http://localhost:3000/api";

async function GetPictureByUser(userId) {
  try {
    const response = await axios.get(`${URL}/users/${userId}/pictures`);
    //endpoint /api/users/:userId/pictures
    console.log(response);
    console.log(response.data);

    return response.data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default GetPictureByUser;

// const response = await axios.get(
//     //   `${URL}/users/a3ffd62e-38af-4f4a-9664-942fc4df31ab/pictures`);
