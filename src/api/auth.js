import axios from "axios";

const API_URL = "http://localhost:5000";

export const loginUser = async ({ email, password }) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erro de login");
  }
};
