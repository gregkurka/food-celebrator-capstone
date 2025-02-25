import React from "react";
import axios from "axios";
const URL = "https://food-celebrator.onrender.com/api";

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
