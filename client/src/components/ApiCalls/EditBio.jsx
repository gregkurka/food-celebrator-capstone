import axios from "axios";
const URL = "https://food-celebrator.onrender.com/api";

async function EditBio(username, updatedBio) {
  try {
    const requestUrl = `${URL}/${username}/bio`;
    console.log(`Sending PUT request to: ${requestUrl}`);
    console.log(`Request Body:`, { updatedBio });

    const response = await axios.put(
      requestUrl,
      { updatedBio }, // Keep matching backend request structure
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("API Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error updating bio:", err.response?.data || err.message);
    throw err;
  }
}

export default EditBio;
