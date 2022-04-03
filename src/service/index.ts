import service from './request';
// 获取轮播
export function getBanner() {
  return service.get('/banner');
}