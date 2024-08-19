import axios from 'axios';

const API_URL = `${import.meta.env.APP_SERVER_URL}/api/v1`;

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  // console.log('AXIOS INT TOKEN', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const api = axios;
export default api;
