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
  async (data) => {
    await sleep();
    if (data.data.code !== 200) {
      window.$message.error('network error');
    }
    return data;
  }, err => {
    window.$message.error('network error');
    return err;
  }
);
const sleep = () => {
  return new Promise((resolve) => {
    setTimeout(
      () => {
        resolve(true);
      }, 4000
    );
  });
};
export default instance;