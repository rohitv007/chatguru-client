import axios from 'axios';

axios.defaults.baseURL = `${import.meta.env.APP_SERVER_URL}/api/v1`;
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem('accessToken'));
  // console.log(token);
  if (token) {
    // console.log("check here", token);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const api = axios;
export default api;
