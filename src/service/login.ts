import service from './request';

//二维码 key 生成接口
export function getQrCode() {
  return service.get('/login/qr/key?timestamp=' + new Date().getTime());
}
// 二维码生成
export function getQrCodeImg(key:string) {
  return service.get(`/login/qr/create?key=${key}&timestamp=${new Date().getTime()}&qrimg=true`);
}
// 二维码检查扫码状态
export function getQrCodeStatus(key:string) {
  return service.get(`/login/qr/check?key=${key}&timestamp=${new Date().getTime()}`);
}
// 退出登录
export function logout() {
  return service.get('/logout?timestamp=' + new Date().getTime());
}