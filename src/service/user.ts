import service from './request';
import qs from 'qs';
// 获取账号信息
export function getUserInfo() {
  return service.get('/user/account');
}
//获取用户详情
export function getUserDetail(uid:string) {
  return service.get('/user/detail?uid='+uid);
}
// 签到
export function signIn() {
  return service.post('/daily_signin?timestamp=' + Date.now()+'&type=1');
}
//更新用户信息
export function updateUserInfo(data:{
  nickname: string,
  signature?: string,
  gender:number;
  birthday?: number|string,
  province?: number|string,
  city?: number|string,
}) {
  const params = qs.stringify({
    ...data,
    timestamp: Date.now()
  });
  return service.get('/user/update?'+params);
}
// 更新头像
export function updateUserAvatar(
  file: File, imgSize:number
) {
  const formData = new FormData();
  formData.append(
    'imgFile', file
  );
  const params = { timestamp: Date.now(), imgSize };
  const url = '/avatar/upload?'+qs.stringify(params);
  return service.post(
    url, formData, { headers: { 'Content-Type': 'multipart/form-data' } }
  );  
}