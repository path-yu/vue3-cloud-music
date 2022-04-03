import axios from 'axios';
// create axios instance
const instance = axios.create({
  baseURL: 'https://netease-cloud-music-api-path-yu.vercel.app',
  timeout: 3000,
  method: 'get',
  withCredentials: true,
});

//add request interceptor
instance.interceptors.request.use((config) => {
  return config;
}, err => {
  return err;
});

export default instance;