import axios from "axios";

const apiBaseURL =
  (import.meta.env.VITE_API_URL || "https://prysm-backend-8a87.onrender.com/api")
    .replace(/\/$/, "")
    .trim();

const axiosInstance = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
});

export default axiosInstance;
