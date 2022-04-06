import service from './request';
// 获取轮播
export function getBanner() {
  return service.get('/banner');
}
// 推荐歌单
export function getPersonalized() {
  return service.get('/personalized?limit=15');
}
// 推荐新音乐
export function getNewSong() {
  return service.get('/personalized/newsong?limit=20');
}
// 推荐 mv
export function getRecommendMv() {
  return service.get('/personalized/mv?limit=3');
}