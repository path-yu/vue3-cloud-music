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
// 获取精品歌单
export function getTopPlayList({ cat = '全部', limit = 10 }) {
  return service.get(`/top/playlist/highquality?limit=${limit}&cat=${cat}`);
}
// 精品歌单标签列表
export function getTopPlayListTags() {
  return service.get('/playlist/highquality/tags');
}