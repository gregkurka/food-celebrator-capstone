import axios from "axios";
const URL = "https://food-celebrator.onrender.com/api";

const GetFeedAll = async (limit, offset) => {
  try {
    const response = await axios.get(
      `${URL}/feed?limit=${limit}&offset=${offset}`
    );
    return response.data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export default GetFeedAll;
