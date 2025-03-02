import axios from "axios";
const URL = "https://food-celebrator.onrender.com/api";

async function GetBio(username) {
  try {
    const requestUrl = `${URL}/${username}/bio`; // Ensure correct path

    const response = await axios.get(requestUrl);

    return { bio: response.data?.bio ?? "" }; // Convert null to empty string
  } catch (err) {
    console.error("Error fetching bio:", err.response?.data || err.message);
    return { bio: "" }; // Return empty string to prevent errors
  }
}

export default GetBio;
