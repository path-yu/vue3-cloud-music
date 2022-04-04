import service from './request';
// 获取轮播
export function getBanner() {
  return service.get('/banner');
}
// 推荐歌单
export function getPersonalized() {
  return service.get('/personalized?limit=15');
}