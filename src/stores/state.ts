import type { AnyObject } from './../../env.d';
export interface StoreState{
  theme: 'dark' | 'light',
  backTopLeft: string;
  isLogin: boolean;
  likeSongs: number[];
  playList: any[];
  userProfile: AnyObject;
  currentPlayIndex: number;
  playMode: playMode,
  playWaiting:boolean;
  currentPlayListId: string,
  playing:boolean,
  mySubscribeSongList:any[],
  playListIdList:string[],
  searchHistory:string[];
  showMusicDetail:boolean;
  searchKeyword:string;
}
export type playMode = 'order' | 'random' | 'singleLoop';
const initState = (
  key:string, defaultVal:any, parse=true
) => {
  return localStorage[key]
    ? parse
      ? JSON.parse(localStorage[key])
      : localStorage[key]
    : defaultVal;
};
const state:StoreState = { 
  theme: initState(
    'theme', 'light', false
  ),
  backTopLeft: initState(
    'backTopLeft', '7vw', false
  ),
  isLogin: initState(
    'isLogin', false
  ),
  userProfile: initState(
    'userProfile', {}
  ),
  likeSongs: initState(
    'likeSongs', []
  ),
  playList: initState(
    'playList', []
  ),
  currentPlayIndex: initState(
    'currentPlayIndex', 0
  ),
  playMode: initState(
    'playMode', 'order', false
  ),
  currentPlayListId: initState(
    'currentPlayListId', '', false
  ),
  playing: false,
  mySubscribeSongList: initState(
    'mySubscribeSongList', []
  ),
  playListIdList: initState(
    'playListIdList', []
  ),
  searchHistory: initState(
    'searchHistory', []
  ),
  searchKeyword: '',
  playWaiting: false,
  showMusicDetail: false
};

export default state;