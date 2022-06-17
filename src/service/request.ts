import axios from 'axios';
// create axios instance
const instance = axios.create({
  baseURL: 'https://netease-cloud-music-api-path-yu.vercel.app',
  method: 'get',
  withCredentials: true
});

//add request interceptor
instance.interceptors.request.use(
  (config) => {
    return config;
  }, err => {
    return err;
  }
);

//response interceptor
instance.interceptors.response.use(
  (data) => {
    return data;
  }, err => {
    window.$message.error('network error');
    return err;
  }
);

export default instance;