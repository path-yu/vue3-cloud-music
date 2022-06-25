import qs from 'qs';
import service from './request';
// 默认搜索关键词
export function getDefaultSearchKeyword() {
  return service.get('/search/default');
}
// 热搜列表
export function getHotSearchList() {
  return service.get('/search/hot/detail');
}
// 搜索建议
export function getSuggestSearchList(keyword: string) {
  return service.get(`/search/suggest?keywords=${keyword}`);
}
export interface SearchParams{
  keywords:string;// 关键词
  type:string;//1 单曲 1000歌单
  limit:number;// 返回数量
  offset?:number
}
//搜索
export function search(data:SearchParams) {
  const query = qs.stringify({
    ...data,
    timestamp: Date.now()
  });
  return service.get('/cloudsearch?'+query);
}