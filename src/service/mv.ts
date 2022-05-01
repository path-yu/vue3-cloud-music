import service from './request';
// 全部mv 列表
export function getMvList({
  limit = 50, 
  offset = 0, area = '全部',
  order = '最热', type = '全部' 
}) {
  return service.get(`/mv/all?limit=${limit}&offset=${offset}&area=${area}&order=${order}&type=${type}`);
}
// mv详情
export function getMvDetail(mvid: number) {
  return service.get(`/mv/detail?mvid=${mvid}`);
}
// 相似推荐mv
export function getSimiMv(mvid: number) {
  return service.get(`/simi/mv?mvid=${mvid}`);
}
// 获取mv 地址
export function getVideoUrl(id: number) {
  return service.get(`/mv/url?id=${id}`);
}
// 推荐 mv
export function getRecommendMv() {
  return service.get('/personalized/mv?limit=3');
}
// mv评论
export function getMvComment({ id='', limit = 20, offset = 0, before='' }) {
  let qs = `id=${id}&limit=${limit}&offset=${offset}`;
  if (before) {
    qs+=`&before=${before}`;
  }
  return service.get(`/comment/mv?${qs}`);
}
