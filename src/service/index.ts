import type { TopAlbumParams } from 'env';
import qs from 'qs';
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
export function getTopPlayList({ cat = '全部', limit = 10, before = '' }) {
  return service.get(`/top/playlist/highquality?cat=${cat}&limit=${limit}&before=${before}`);
}
// 精品歌单标签列表
export function getTopPlayListTags() {
  return service.get('/playlist/highquality/tags');
}
// 全部mv 列表
export function getMvList({ limit = 50, offset = 0, area = '全部', order = '最热' }) {
  return service.get(`/mv/all?limit=${limit}&offset=${offset}&area=${area}&order=${order}`);
}
// 新歌速递
export function getTopSong(type: 0 | 7 | 96 |8 | 16=0) {
  return service.get(`/top/song?type=${type}`);
}
// 新碟上架
export function getNewTopAlbum(params: TopAlbumParams) {
  const date = new Date();
  const nowYear = date.getFullYear();
  const nowMonth = date.getMonth();
  const { limit=50, offset=0, area='全部', type='全部', year=nowYear, month=nowMonth } = params;
  const data:TopAlbumParams = { limit, offset, area, type, year, month };
  console.log(qs.stringify(data));
  
  return service.get('/top/album?'+qs.stringify(data));
}