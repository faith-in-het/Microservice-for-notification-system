import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; // Assuming the upstream API is running on port 3000

export const getFanficFollowers = async (fanficId) => {
  let followers = [];
  let hasMore = true;
  let cursor = null;

  while (hasMore) {
    const response = await axios.get(
      `${API_BASE_URL}/fanfics/${fanficId}/followers`,
      {
        params: { cursor },
      }
    );
    followers = followers.concat(response.data.page);
    hasMore = response.data.hasMore;
    cursor = response.data.cursor;
  }

  return followers;
};

export const getFanfic = async (fanficId) => {
  const response = await axios.get(`${API_BASE_URL}/fanfics/${fanficId}`);
  return response.data;
};

export const getUser = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
  return response.data;
};

export const getEpisode = async (fanficId, episodeNumber) => {
  const response = await axios.get(
    `${API_BASE_URL}/fanfics/${fanficId}/episodes/${episodeNumber}`
  );
  return response.data;
};