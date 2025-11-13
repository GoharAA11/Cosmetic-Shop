import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // VITE_ env variable-ից կվերցնի URL-ը
});

export default api;
