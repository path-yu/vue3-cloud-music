import qs from 'qs';
import service from './request';
// 推荐新音乐
export function getNewSong() {
  return service.get('/personalized/newsong?limit=20');
}
// 新歌速递
export function getTopSong(type: 0 | 7 | 96 |8 | 16=0) {
  return service.get(`/top/song?type=${type}`);
}
// 获取歌手单曲可 获得歌手部分信息和热门歌曲
export function getSingerSong(id: number) {
  return service.get(`/artists?id=${id}`);
}
// 我喜欢的音乐列表
export function getLikeList(uid: number) {
  const query = qs.stringify({
    uid,
    timestamp: Date.now()
  });
  return service.get(`/likelist?${query}`);
}