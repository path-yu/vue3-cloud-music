import service from './request';
// 获取轮播
export function getBanner() {
  return service.get('/banner');
}
export * from './mv';
export * from './playlist';
export * from './songs';
export * from './login';