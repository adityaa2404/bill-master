// frontend/src/config/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
console.log("🔥 FRONTEND API BASE URL:", API_BASE_URL);
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

export default api;

