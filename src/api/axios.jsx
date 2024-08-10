import axios from "axios";

axios.defaults.baseURL = import.meta.env.APP_API_URL;
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    // console.log("check here", token);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
