import axios from 'axios';
// create axios instance
const instance = axios.create({
  baseURL: 'http://localhost:3000/',
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
const loginQrCode = [
  800, 801, 802, 803
];
//response interceptor
instance.interceptors.response.use(
  async (data) => {
    return data;
  }, err => {
    window.$message.error('network error');
    console.log(err);
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