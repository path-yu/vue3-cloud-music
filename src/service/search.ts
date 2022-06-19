import service from './request';
// 默认搜索关键词
export function getDefaultSearchKeyword() {
  return service.get('/search/default');
}