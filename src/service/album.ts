import service from './request';

// 获取专辑详情
export function getAlbumDetail(id:string) {
  return service.get('/album?id='+id);
}