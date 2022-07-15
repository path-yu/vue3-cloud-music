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
// 获取音乐url
export function getMusicUrl(id:string) {
  const query = qs.stringify({
    timestamp: Date.now(),
    id
  });
  return service.get('/song/url?'+query);
}
// 获取歌词
export function getLyric(id:string) {
  return service.get('/lyric?id='+id);
}
// 检查音乐是否可用
export function checkMusic(id:string) {
  return service.get('/check/music?id='+id);
}
// 歌曲评论
export function getMusicComment(data:{
  id:string;
  limit?:number;
  offset?:number;
  before?:string;}) {
  const query = qs.stringify({
    timestamp: Date.now(),
    ...data
  });
  return service.get('/comment/music?'+query);
}
// 喜欢音乐
export function likeMusic(id:number, like:boolean) {
  return service.get(`/like?id=${id}&like=${like}`); 
}