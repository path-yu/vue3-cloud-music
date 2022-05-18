import type { AnyObject } from './../../env.d';
export interface StoreState{
  theme: 'dark' | 'light',
  backTopLeft: string;
  isLogin: boolean;
  likeSongs: number[];
  playList: any[];
  userProfile: AnyObject | null;
  currentPlayIndex: number;
  playMode: playMode,
  currentPlayListId: number,
}
export type playMode = 'order' | 'random' | 'singleLoop';

const state:StoreState = { 
  // 当前主题 默认light
  theme: localStorage.theme || 'light',
  // 回到顶部按钮的位置
  backTopLeft: localStorage.backTopLeft || '7vw',
  // 是否登录
  isLogin: localStorage.isLogin && JSON.parse(localStorage.isLogin) || false,
  // 用户详情
  userProfile: localStorage.userProfile && JSON.parse(localStorage.userProfile) || null,
  //我喜欢的歌曲列表
  likeSongs: localStorage.likeSongs && JSON.parse(localStorage.likeSongs) || [],
  // 播放列表
  playList: localStorage.playList && JSON.parse(localStorage.playList) || [],
  // 当前播放的歌曲下标
  currentPlayIndex: localStorage.currentPlayIndex || 0,
  // 播放模式
  playMode: localStorage.playMode || 'order',
  // 当前播放歌单列表id
  currentPlayListId: localStorage.currentPlayListId || 0
};

export default state;