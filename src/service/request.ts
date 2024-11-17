import axios from 'axios';
// create axios instance
const instance = axios.create({
  // 由于网易限制,此项目在国外服务器上vercel使用会受到限制 导致媒体资源加载不出来
  baseURL: 'https://musicapi-git-main-pathyus-projects.vercel.app/',
  // baseURL:"http://localhost:3000",
  method: 'get',
  withCredentials: true,
  
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