import axios from "axios";
const URL = "http://localhost:3000/api";

const GetFeedAll = async () => {
  try {
    const response = await axios.get(`${URL}/feed`);
    return response.data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export default GetFeedAll;
