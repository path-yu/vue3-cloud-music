import axios from 'axios';
// create axios instance
const instance = axios.create({
  baseURL: 'https://netease-cloud-music-api-path-yu.vercel.app',
  method: 'get',
  withCredentials: true
});

//add request interceptor
instance.interceptors.request.use((config) => {
  return config;
}, err => {
  console.log(err);
  return err;
});
//response interceptor
instance.interceptors.response.use(async (data) => {
  // await sleep();
  return data;
}, err => {
  console.log(err);
  return err;
});
const sleep = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 4000);
  });
};
export default instance;