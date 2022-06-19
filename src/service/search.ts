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