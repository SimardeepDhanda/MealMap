// src/services/api.js
import axios from 'axios';

// If your backend is running on localhost:3000
const API_BASE_URL = 'http://localhost:3000';

export const submitUserData = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/api/plan`, formData);
  return response.data;
};
