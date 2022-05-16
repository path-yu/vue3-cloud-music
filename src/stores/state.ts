import type { AnyObject } from './../../env.d';
export interface StoreState{
  theme: 'dark' | 'light',
  backTopLeft: string;
  isLogin: boolean;
  likeSongs: number[];
  playList: any[];
  userProfile: AnyObject | null;
  currentPlayIndex: number;
  playMode: 'order' | 'random' | 'heartbeat' | 'singleLoop'
}
export type playMode = 'order' | 'random' | 'heartbeat' | 'singleLoop';
const state:StoreState = { 
  theme: localStorage.theme || 'light',
  backTopLeft: localStorage.backTopLeft || '7vw',
  isLogin: localStorage.isLogin && JSON.parse(localStorage.isLogin) || false,
  userProfile: localStorage.userProfile && JSON.parse(localStorage.userProfile) ||null,
  likeSongs: localStorage.likeSongs && JSON.parse(localStorage.likeSongs) || [],
  // 播放列表
  playList: localStorage.playList && JSON.parse(localStorage.playList) || ['a', 'b', 'c'],
  // 当前播放的歌曲下标
  currentPlayIndex: localStorage.currentPlayIndex || 0,
  // 播放模式
  playMode: localStorage.playMode || 'order'
};
export default state;