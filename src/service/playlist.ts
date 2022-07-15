import qs from 'qs';
import service from './request';
// 获取精品歌单
export function getTopPlayList({ cat = '全部', limit = 10, before = '' }) {
  return service.get(`/top/playlist/highquality?cat=${cat}&limit=${limit}&before=${before}`);
}
// 精品歌单标签列表
export function getTopPlayListTags() {
  return service.get('/playlist/highquality/tags');
}
// 推荐歌单
export function getPersonalized() {
  return service.get('/personalized?limit=15');
}
// 获取歌单详情
export function getPlaylistDetail(id: string) {
  const query = qs.stringify({
    id,
    timestamp: Date.now()
  });
  return service.get('/playlist/detail?'+query);
}
// 获取歌单所有数据
export function getPlaylistAllDetail(data:{
  id: string,
  limit?: number,
  offset?: number,
}) {
  const query = qs.stringify({
    ...data,
    timestamp: Date.now()
  });
  return service.get('/playlist/track/all?'+query);
}
// 更新歌单标签
export function updatePlaylistTags(data: {
  id: string,
  tags: string
}) {
  const query = qs.stringify({
    ...data,
    timestamp: Date.now()
  });
  return service.get('/playlist/tags/update?'+query);
}
// 编辑歌单
export function updatePlayListInfo(data:{
  id:string;
  name:string;
  tags:string;
  desc:string;
}) {
  const query = qs.stringify({
    id: data.id,
    name: data.name,
    tags: data.tags,
    desc: data.desc,
    timestamp: Date.now()
  });
  return service.get('/playlist/update?'+query);
}
// 更新歌单封面
export function updatePlayListCover(
  file: File, imgSize:number, id:string
) {
  const formData = new FormData();
  formData.append('imgFile', file);
  const params = { timestamp: Date.now(), imgSize, id };
  const url = '/playlist/cover/update?'+qs.stringify(params);
  return service.post(
    url, formData, { headers: { 'Content-Type': 'multipart/form-data' } }
  );  
}
// 收藏/取消收藏歌单
export function updatePlayListSubscribe(data:{
  id:string;
  t:number;// 1:收藏，2:取消收藏
}) {
  const query = qs.stringify({
    id: data.id,
    t: data.t,
    timestamp: Date.now()
  });
  return service.get('/playlist/subscribe?'+query);
}
// 歌单评论
export function getPlaylistComment(data:{
  id:string;
  limit?:number;
  offset?:number;
  before?:string;
}) {
  const query = qs.stringify(data);
  return service.get('/comment/playlist?'+query);
}
// 相似歌单
export function getSimilarPlaylist(id:string) {
  return service.get('/simi/playlist?id='+id);
}
// 相似歌曲
export function getSimilarSong(id:string) {
  return service.get('/simi/song?id='+id);
}
//对歌单添加或删除歌曲
export function updatePlaylistTracks(data:{
  tracks:number;//歌曲id
  pid:number;// 歌单id
  op:'add'|'del';// 1:添加，2:删除
}) {
  const query = qs.stringify({
    tracks: data.tracks,
    pid: data.pid,
    op: data.op,
    timestamp: Date.now()
  });
  return service.get('/playlist/tracks?'+query);
}
// 新建歌单
export function createPlaylist(data:{
  name:string;
  privacy?:string;// 默认否，传'10'则设置成隐私歌单
}) {
  const query = qs.stringify({
    name: data.name,
    privacy: data.privacy,
    timestamp: Date.now()
  });
  return service.get('/playlist/create?'+query);
}