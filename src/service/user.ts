import service from './request';
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