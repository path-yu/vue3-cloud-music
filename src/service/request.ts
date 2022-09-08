import axios from 'axios';
// create axios instance
const instance = axios.create({
  baseURL: 'https://www.lghb.top/',
  method: 'get',
  withCredentials: true
});

//add request interceptor
instance.interceptors.request.use((config) => {
  return config;
}, err => {
  return Promise.reject(err);
});

//response interceptor
instance.interceptors.response.use((data) => {
  return data;
}, err => {
  window.$message.error('network error');
  return Promise.reject(err);
});

export default instance;